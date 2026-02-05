import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import { PRODUCTS, COLLECTION_TYPES, type ProductData } from "../data/products";

// GraphQL mutations
const PRODUCT_SET_MUTATION = `
  mutation productSet($input: ProductSetInput!) {
    productSet(input: $input) {
      product {
        id
        title
        handle
        status
      }
      userErrors {
        field
        message
        code
      }
    }
  }
`;

const PRODUCT_BY_HANDLE_QUERY = `
  query productByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      id
      title
    }
  }
`;

const COLLECTION_CREATE_MUTATION = `
  mutation collectionCreate($input: CollectionInput!) {
    collectionCreate(input: $input) {
      collection {
        id
        title
        handle
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const COLLECTION_BY_HANDLE_QUERY = `
  query collectionByHandle($handle: String!) {
    collectionByHandle(handle: $handle) {
      id
      title
    }
  }
`;

const COLLECTION_ADD_PRODUCTS_MUTATION = `
  mutation collectionAddProducts($id: ID!, $productIds: [ID!]!) {
    collectionAddProducts(id: $id, productIds: $productIds) {
      collection {
        id
        title
        productsCount {
          count
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// Transform product data to Shopify GraphQL input
function transformToShopifyInput(product: ProductData) {
    return {
        title: product.title,
        descriptionHtml: product.descriptionHtml,
        vendor: product.vendor,
        productType: product.productType,
        tags: product.tags,
        status: "ACTIVE",
        productOptions: [
            {
                name: "Title",
                position: 1,
                values: [{ name: "Default Title" }]
            }
        ],
        variants: [
            {
                optionValues: [{ optionName: "Title", name: "Default Title" }],
                price: product.price,
                compareAtPrice: product.compareAtPrice !== "0.00" && product.compareAtPrice !== product.price
                    ? product.compareAtPrice
                    : null,
                sku: product.sku,
                inventoryPolicy: "DENY",
            }
        ],
        files: product.images.map((url, index) => ({
            originalSource: url,
            contentType: "IMAGE",
            alt: index === 0 ? product.title : `${product.title} - Image ${index + 1}`
        }))
    };
}

// Create collection and return its ID
async function createOrGetCollection(admin: any, title: string): Promise<string | null> {
    const handle = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

    try {
        // Check if collection exists
        const existingResponse = await admin.graphql(COLLECTION_BY_HANDLE_QUERY, {
            variables: { handle }
        });
        const existingData = await existingResponse.json();

        if (existingData.data?.collectionByHandle?.id) {
            return existingData.data.collectionByHandle.id;
        }

        // Create new collection
        const response = await admin.graphql(COLLECTION_CREATE_MUTATION, {
            variables: {
                input: {
                    title,
                    descriptionHtml: `<p>Browse our ${title} collection</p>`,
                    ruleSet: null // Manual collection
                }
            }
        });

        const data = await response.json();

        if (data.data?.collectionCreate?.collection?.id) {
            return data.data.collectionCreate.collection.id;
        }

        return null;
    } catch (error) {
        console.error(`Failed to create collection ${title}:`, error);
        return null;
    }
}

// Add products to a collection
async function addProductsToCollection(admin: any, collectionId: string, productIds: string[]) {
    if (!productIds.length) return;

    try {
        await admin.graphql(COLLECTION_ADD_PRODUCTS_MUTATION, {
            variables: {
                id: collectionId,
                productIds
            }
        });
    } catch (error) {
        console.error(`Failed to add products to collection:`, error);
    }
}

// GET: Get import status and available products
export const loader = async ({ request }: LoaderFunctionArgs) => {
    await authenticate.admin(request);

    return {
        totalProducts: PRODUCTS.length,
        collectionTypes: COLLECTION_TYPES,
        products: PRODUCTS.map(p => ({
            handle: p.handle,
            title: p.title,
            productType: p.productType,
            price: p.price,
            image: p.images[0]
        }))
    };
};

// POST: Import products
export const action = async ({ request }: ActionFunctionArgs) => {
    const { admin } = await authenticate.admin(request);
    const formData = await request.formData();
    const actionType = formData.get("action") as string;

    if (actionType === "import-all") {
        const results: {
            success: string[];
            failed: { handle: string; error: string }[];
            skipped: string[];
            collections: string[];
        } = {
            success: [],
            failed: [],
            skipped: [],
            collections: []
        };

        // Track product IDs by type for collection assignment
        const productsByType: Map<string, string[]> = new Map();

        // Process products in batches
        const BATCH_SIZE = 2;
        const DELAY_MS = 1500;

        for (let i = 0; i < PRODUCTS.length; i += BATCH_SIZE) {
            const batch = PRODUCTS.slice(i, i + BATCH_SIZE);

            for (const product of batch) {
                try {
                    // Check if product already exists
                    const existingResponse = await admin.graphql(PRODUCT_BY_HANDLE_QUERY, {
                        variables: { handle: product.handle }
                    });
                    const existingData = await existingResponse.json();

                    if (existingData.data?.productByHandle?.id) {
                        results.skipped.push(product.handle);
                        // Still track for collection assignment
                        const productId = existingData.data.productByHandle.id;
                        if (!productsByType.has(product.productType)) {
                            productsByType.set(product.productType, []);
                        }
                        productsByType.get(product.productType)!.push(productId);
                        continue;
                    }

                    // Create the product
                    const input = transformToShopifyInput(product);
                    const response = await admin.graphql(PRODUCT_SET_MUTATION, {
                        variables: { input }
                    });

                    const data = await response.json();

                    if (data.data?.productSet?.userErrors?.length > 0) {
                        results.failed.push({
                            handle: product.handle,
                            error: data.data.productSet.userErrors.map((e: any) => `${e.field}: ${e.message}`).join(", ")
                        });
                    } else if (data.data?.productSet?.product) {
                        results.success.push(product.handle);

                        // Track product ID for collection assignment
                        const productId = data.data.productSet.product.id;
                        if (!productsByType.has(product.productType)) {
                            productsByType.set(product.productType, []);
                        }
                        productsByType.get(product.productType)!.push(productId);
                    } else if ((data as any).errors) {
                        results.failed.push({
                            handle: product.handle,
                            error: (data as any).errors.map((e: any) => e.message).join(", ")
                        });
                    } else {
                        results.failed.push({
                            handle: product.handle,
                            error: "Unknown error"
                        });
                    }
                } catch (error: any) {
                    results.failed.push({
                        handle: product.handle,
                        error: error.message || "Request failed"
                    });
                }
            }

            // Add delay between batches
            if (i + BATCH_SIZE < PRODUCTS.length) {
                await new Promise(resolve => setTimeout(resolve, DELAY_MS));
            }
        }

        // Create only the 5 specific collections
        const FIXED_COLLECTIONS = [
            "Electrical Lighting",
            "Home Decor",
            "Best Selling",
            "Trending",
            "Accessories"
        ];

        console.log("Creating fixed collections:", FIXED_COLLECTIONS);

        for (const collectionTitle of FIXED_COLLECTIONS) {
            const collectionId = await createOrGetCollection(admin, collectionTitle);
            if (collectionId) {
                // Find products that match this collection
                let productsForCollection: string[] = [];

                // Map collection to product types
                if (collectionTitle === "Electrical Lighting") {
                    productsForCollection = productsByType.get("Electrical Lighting") || [];
                } else if (collectionTitle === "Home Decor") {
                    productsForCollection = productsByType.get("Home Decor") || [];
                } else if (collectionTitle === "Accessories") {
                    productsForCollection = productsByType.get("Accessories") || [];
                } else if (collectionTitle === "Best Selling" || collectionTitle === "Trending") {
                    // Add all imported products to Best Selling and Trending
                    for (const ids of productsByType.values()) {
                        productsForCollection.push(...ids);
                    }
                }

                if (productsForCollection.length > 0) {
                    await addProductsToCollection(admin, collectionId, productsForCollection);
                }
                results.collections.push(collectionTitle);
            }
        }

        return {
            action: "import-all",
            results,
            summary: {
                total: PRODUCTS.length,
                imported: results.success.length,
                skipped: results.skipped.length,
                failed: results.failed.length,
                collectionsCreated: results.collections.length
            }
        };
    }

    if (actionType === "import-single") {
        const handle = formData.get("handle") as string;
        const product = PRODUCTS.find(p => p.handle === handle);

        if (!product) {
            return { error: "Product not found" };
        }

        try {
            // Check if product already exists
            const existingResponse = await admin.graphql(PRODUCT_BY_HANDLE_QUERY, {
                variables: { handle: product.handle }
            });
            const existingData = await existingResponse.json();

            if (existingData.data?.productByHandle?.id) {
                return { error: "Product already exists", skipped: true };
            }

            const input = transformToShopifyInput(product);
            const response = await admin.graphql(PRODUCT_SET_MUTATION, {
                variables: { input }
            });

            const data = await response.json();

            if (data.data?.productSet?.userErrors?.length > 0) {
                return {
                    error: data.data.productSet.userErrors.map((e: any) => `${e.field}: ${e.message}`).join(", ")
                };
            }

            // Add to collection
            if (data.data?.productSet?.product?.id) {
                const productId = data.data.productSet.product.id;
                const collectionInfo = COLLECTION_TYPES.find(c => c.productType === product.productType);
                const collectionTitle = collectionInfo?.title || product.productType;

                const collectionId = await createOrGetCollection(admin, collectionTitle);
                if (collectionId) {
                    await addProductsToCollection(admin, collectionId, [productId]);
                }
            }

            return {
                success: true,
                product: data.data?.productSet?.product,
                collection: product.productType
            };
        } catch (error: any) {
            return { error: error.message || "Failed to create product" };
        }
    }

    if (actionType === "create-collections") {
        // Just create all collections without importing products
        const created: string[] = [];

        for (const collection of COLLECTION_TYPES) {
            const id = await createOrGetCollection(admin, collection.title);
            if (id) {
                created.push(collection.title);
            }
        }

        // Also create special collections
        for (const title of ["Best Selling", "Trending", "New Arrivals"]) {
            const id = await createOrGetCollection(admin, title);
            if (id) {
                created.push(title);
            }
        }

        return {
            action: "create-collections",
            collections: created,
            count: created.length
        };
    }

    return { error: "Invalid action" };
};
