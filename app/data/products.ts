// Product data extracted from products_export.csv
// Total: 50 products with images, descriptions, and metadata

export interface ProductData {
    handle: string;
    title: string;
    descriptionHtml: string;
    productType: string;
    vendor: string;
    price: string;
    compareAtPrice: string;
    sku: string;
    images: string[];
    tags: string[];
}

// Collection types derived from product types
export const COLLECTION_TYPES = [
    { title: "Electronics", productType: "Electronics" },
    { title: "Garden & Outdoors", productType: "Garden & Outdoors" },
    { title: "Gifts", productType: "Gift" },
    { title: "Health & Beauty", productType: "Health & Beauty Accessories" },
    { title: "Home & Kitchen", productType: "Home & Kitchen" },
    { title: "Home Decor", productType: "Home Decor" },
    { title: "Home Improvement", productType: "Home Improvement" },
    { title: "Mobile Accessories", productType: "mobile accessories" },
    { title: "Office Products", productType: "Office Products" },
    { title: "Toys & Games", productType: "Toys & Games" },
] as const;

// All products from the CSV
export const PRODUCTS: ProductData[] = [
    {
        handle: "3-in-1-cable-jb-247",
        title: "3 IN 1 CABLE JB-247",
        descriptionHtml: "<p>USB 2.0 COMPATIBLE PORT</p><p>DATA SYNC</p><p>COMPATIBLE WITH LIGHTNING,TYPE C,MICRO USB</p><p>STRONG BAND PROTECTION</p><p>BRAIDED CABLE</p><p>15W HIGH EFFICIENCY AND FAST CHARGING</p>",
        productType: "Electronics",
        vendor: "MC",
        price: "699.00",
        compareAtPrice: "599.00",
        sku: "whl191_64749_cable_3in1_jb247",
        images: [
            "https://cdn.shopify.com/s/files/1/0737/1305/7844/files/dBTRSeunEC.jpg?v=1764056456",
            "https://cdn.shopify.com/s/files/1/0737/1305/7844/files/IqZuHPUrMh.jpg?v=1764056456",
            "https://cdn.shopify.com/s/files/1/0737/1305/7844/files/KisrlIR4Ms.jpg?v=1764056456"
        ],
        tags: ["CABLE", "ELECTRONICS", "MOBILE ACCESSORIES"]
    },
    {
        handle: "christmas-themed-bathroom-mat-set",
        title: "3 in 1 Christmas-Themed Bathroom Mat - (1 Set)",
        descriptionHtml: "<p><strong>3 in1 Christmas-Themed 3-Piece Bathroom Mat Set – Snowman Print | Soft Microfiber with Anti-Skid Backing | Bath Mat + U-Shaped Contour Mat + Toilet Lid Cover | Washable Festive Décor</strong></p><p>Dress up your bathroom for the holidays! This cozy 3-piece Christmas bathroom set features a cheerful snowman print and Merry Christmas signage to bring instant festive vibes.</p>",
        productType: "Home Improvement",
        vendor: "DeoDap",
        price: "699.00",
        compareAtPrice: "299.00",
        sku: "19485_christmas_bathroom_mat_set",
        images: [
            "https://cdn.shopify.com/s/files/1/0737/1305/7844/files/001_6f7c189d-7b1e-45fa-8338-d41a4509704c.jpg?v=1764056456"
        ],
        tags: ["Bathroom Accessories", "BATHROOM MAT", "Home", "Home Improvement"]
    },
    {
        handle: "3-layer-foldable-stainless-steel-cloth-drying-stand-with-wheels",
        title: "3 Layer Foldable Stainless Steel Cloth Drying Stand with Wheels",
        descriptionHtml: "<p><strong>3 Layer Foldable Stainless Steel Cloth Drying Stand with Wheels – Heavy Duty Indoor & Outdoor Laundry Drying Rack</strong></p><p>This 3 Layer Foldable Stainless Steel Cloth Drying Stand is a durable and space-saving solution for drying clothes indoors and outdoors.</p>",
        productType: "Home Improvement",
        vendor: "DeoDap",
        price: "3499.00",
        compareAtPrice: "3500.00",
        sku: "15840_ss_3layer_fold_cloth_drying_stand_n_wheels",
        images: [
            "https://cdn.shopify.com/s/files/1/0737/1305/7844/files/Clothes-Drying-Stand-01.jpg?v=1764056457"
        ],
        tags: ["Cloth Drying Stand", "Home Improvement", "Home Storage"]
    },
    {
        handle: "insulated-lunch-box-set-with-handle-strap-set",
        title: "3 Layer Insulated Lunch Box Set with Handle & Strap - (Set)",
        descriptionHtml: "<p>Insulated lunch box set with multiple layers, handle and strap for easy carrying.</p>",
        productType: "Home & Kitchen",
        vendor: "DeoDap",
        price: "599.00",
        compareAtPrice: "299.00",
        sku: "10703_status_insulated_lunch_box_set",
        images: [
            "https://cdn.shopify.com/s/files/1/0737/1305/7844/files/01_ecc21d1a-e567-42a4-9764-32eb9b1ad192.jpg?v=1764056458"
        ],
        tags: ["Home & Kitchen", "Lunch Box", "Office Products"]
    },
    {
        handle: "3-compartment-lunch-box-1-pc",
        title: "3-Compartment Lunch Box - (1 Pc)",
        descriptionHtml: "<p>3-compartment lunch box for organized meal storage.</p>",
        productType: "Home & Kitchen",
        vendor: "DeoDap",
        price: "799.00",
        compareAtPrice: "499.00",
        sku: "10717_3_compartment_tokiyo_lunch_box",
        images: [
            "https://cdn.shopify.com/s/files/1/0737/1305/7844/files/01_3f8b1dae-e220-4cd1-aec7-68dc668f8178.jpg?v=1764056458"
        ],
        tags: ["Home & Kitchen", "Lunch Box", "Office Products"]
    },
    {
        handle: "3-in-1-colorful-sand-timer-set",
        title: "3-in-1 Colorful Sand Timer Set (1 Min, 3 Min, 5 Min) with Wooden Frame",
        descriptionHtml: "<p>Visual Time Management Hourglass for Kids, Study, Office, Kitchen & Meditation – Durable Glass Sand Clocks</p>",
        productType: "Gift",
        vendor: "WGM",
        price: "664.00",
        compareAtPrice: "294.00",
        sku: "whl175_66741_wtl_335",
        images: [
            "https://cdn.shopify.com/s/files/1/0737/1305/7844/files/5mgVVoR1jQ.jpg?v=1764056459"
        ],
        tags: ["Gift", "Gift Products", "Timer"]
    },
    {
        handle: "3-in-1-led-lamp-with-humidifier-and-mosquito-repellent-1-pc",
        title: "3-in-1 LED Lamp with Humidifier and Mosquito Repellent (1 Pc)",
        descriptionHtml: "<p>Multi-functional LED lamp with humidifier and mosquito repellent features.</p>",
        productType: "Health & Beauty Accessories",
        vendor: "DeoDap",
        price: "899.00",
        compareAtPrice: "899.00",
        sku: "14685_3in1_humidifier_n_mosquito_lamp",
        images: [
            "https://cdn.shopify.com/s/files/1/0737/1305/7844/files/01-10-2025Offer_page-0001.jpg?v=1764056460"
        ],
        tags: ["Health & Beauty", "Home Decor", "Humidifier", "LED Lamp"]
    },
    {
        handle: "3-in-1-multi-charging-cable",
        title: "3-in-1 Multi Charging Cable",
        descriptionHtml: "<p>Universal charging cable compatible with multiple device types.</p>",
        productType: "mobile accessories",
        vendor: "DeoDap",
        price: "699.00",
        compareAtPrice: "99.00",
        sku: "14181_3in1_multi_charging_cable",
        images: [
            "https://cdn.shopify.com/s/files/1/0737/1305/7844/files/02_cable.jpg?v=1764056460"
        ],
        tags: ["Cable", "Mobile Accessories", "Mobile Cables"]
    },
    {
        handle: "3-layer-classic-transparent-drawer-storage-organizer",
        title: "3-Layer Classic Transparent Drawer Storage Organizer",
        descriptionHtml: "<p>Transparent drawer organizer for easy visibility and storage.</p>",
        productType: "Home Improvement",
        vendor: "DeoDap",
        price: "899.00",
        compareAtPrice: "799.00",
        sku: "17525_3layer_classic_transparent_drawer",
        images: [
            "https://cdn.shopify.com/s/files/1/0737/1305/7844/files/3-Storage-Drawers-01.jpg?v=1764056461"
        ],
        tags: ["Drawer Organizer", "Home Improvement", "Office Products", "Storage Organizer"]
    },
    {
        handle: "3-layer-plastic-storage-drawer-cabinet",
        title: "3-Layer Plastic Storage Drawer Cabinet",
        descriptionHtml: "<p>Multi-layer plastic storage cabinet with drawers.</p>",
        productType: "Home Improvement",
        vendor: "DeoDap",
        price: "1199.00",
        compareAtPrice: "1499.00",
        sku: "19879_3_layer_storage_drawer_1pc",
        images: [
            "https://cdn.shopify.com/s/files/1/0737/1305/7844/files/02_cabinet.jpg?v=1764056462"
        ],
        tags: ["Home Improvement", "Office Products", "Rack"]
    },
    {
        handle: "3-layer-round-metal-mesh-utility-storage-trolley-with-wheels",
        title: "3-Layer Round Metal Mesh Utility Storage Trolley with Wheels",
        descriptionHtml: "<p>Multi-purpose storage trolley with rounded metal mesh layers and wheels for mobility.</p>",
        productType: "Home Improvement",
        vendor: "Organivo",
        price: "999.00",
        compareAtPrice: "2199.00",
        sku: "19541_3_layer_round_metal_mesh",
        images: [
            "https://cdn.shopify.com/s/files/1/0737/1305/7844/files/tier-01.jpg?v=1764056463"
        ],
        tags: ["Home & Kitchen", "Home Improvement", "Kitchen Tools"]
    },
    {
        handle: "300-ml-cute-cartoon-printed-plastic-water-bottle",
        title: "300 ML Cute Cartoon Printed Plastic Water Bottle",
        descriptionHtml: "<p>Cute plastic water bottle with cartoon prints, 300ml capacity.</p>",
        productType: "Home & Kitchen",
        vendor: "DeoDap",
        price: "569.00",
        compareAtPrice: "199.00",
        sku: "14838_cartoon_print_plastic_water_bottle_300ml",
        images: [
            "https://cdn.shopify.com/s/files/1/0737/1305/7844/files/waterbottle-WOSKU-01.jpg?v=1764056464"
        ],
        tags: ["Office Products", "School Supplies", "Water Bottle"]
    },
    {
        handle: "357-speed-rubik-s-cubes-3x3x3x-set-of-12",
        title: "357 Speed Rubik's Cubes 3x3x3x (Set of 12)",
        descriptionHtml: "<p>Set of 12 speed Rubik's cubes for puzzle enthusiasts.</p>",
        productType: "Toys & Games",
        vendor: "DeoDap",
        price: "449.00",
        compareAtPrice: "999.00",
        sku: "19647_357_speed_cube_puzzle_3x3x3_12pc",
        images: [
            "https://cdn.shopify.com/s/files/1/0737/1305/7844/files/01_1134af7a-6394-4a7d-b962-64feb9d9ed8d.jpg?v=1764056465"
        ],
        tags: ["Education Toys", "Gift", "Learning Toys", "Puzzle", "Toys & Games"]
    },
    {
        handle: "360-rotating-multipurpose-storage-rack-with-handles-1-pc",
        title: "360° Rotating Multipurpose Storage Rack with Handles (1 Pc)",
        descriptionHtml: "<p>Rotating storage rack with handles for versatile organization.</p>",
        productType: "Home Improvement",
        vendor: "DeoDap",
        price: "699.00",
        compareAtPrice: "299.00",
        sku: "19850_rotating_multi_storage_rack_1pc",
        images: [
            "https://cdn.shopify.com/s/files/1/0737/1305/7844/files/20b3b520-76d3-4b9f-bf4f-cd2ff431c436.jpg?v=1764056465"
        ],
        tags: ["Home Improvement", "Kitchen Accessories", "Kitchen Tools"]
    },
    {
        handle: "self-spinning-handheld-salad-spinner-and-colander",
        title: "360° Rotating Salad Spinner with Handle | Multi-Function Vegetable Fruit Dryer Basket",
        descriptionHtml: "<p>Manual handheld spin dryer bowl for washing, rinsing, drying lettuce, herbs, greens, and fruits. BPA-Free plastic kitchen colander.</p>",
        productType: "Home & Kitchen",
        vendor: "WGM",
        price: "759.00",
        compareAtPrice: "558.00",
        sku: "whl175_50022_kp_3_ba",
        images: [
            "https://cdn.shopify.com/s/files/1/0737/1305/7844/files/vOumuAgCgd.jpg?v=1764056466"
        ],
        tags: ["Home & Kitchen", "Plastic"]
    },
    {
        handle: "360-spin-mop-with-super-absorbent-microfiber-heads-1-set",
        title: "360° Spin Mop with Super Absorbent Microfiber Heads (1 Set)",
        descriptionHtml: "<p>Spin mop set with super absorbent microfiber heads for efficient cleaning.</p>",
        productType: "Office Products",
        vendor: "Velvet Wipe",
        price: "899.00",
        compareAtPrice: "999.00",
        sku: "19634_ss_jali_cleanova_bucket_mop",
        images: [
            "https://cdn.shopify.com/s/files/1/0737/1305/7844/files/d7da6be6-f39a-4c5f-b320-96e95b69f6ec_0cde26de-9fe5-4aa0-b51a-d5b59b16c953.jpg?v=1764056467"
        ],
        tags: ["Cleaning Supplies", "Home Improvement", "Office Products"]
    },
    {
        handle: "3d-acrylic-led-night-lamp-game-controller-shape-decorative-light-for-gamers-1-pc",
        title: "3D Acrylic LED Night Lamp – Game Controller Shape Decorative Light for Gamers (1 Pc)",
        descriptionHtml: "<p>Decorative LED night lamp shaped like a game controller.</p>",
        productType: "Home Decor",
        vendor: "DeoDap",
        price: "799.00",
        compareAtPrice: "299.00",
        sku: "14892_3d_illusion_led_night_lamp_no10",
        images: [
            "https://cdn.shopify.com/s/files/1/0737/1305/7844/files/1_77776633-c8fc-4778-8cde-1c8945e22c5f.jpg?v=1764056467"
        ],
        tags: ["Diwali Decoration", "Home Decor"]
    },
    {
        handle: "3d-acrylic-led-night-lamps-dinosaur-design-amp-gaming-theme",
        title: "3D Acrylic LED Night Lamps – (1 Pc / Mix Design)",
        descriptionHtml: "<p>Acrylic LED night lamps in various designs including dinosaur and gaming themes.</p>",
        productType: "Home Decor",
        vendor: "DeoDap",
        price: "799.00",
        compareAtPrice: "299.00",
        sku: "14890_3d_illusion_led_night_lamp_no12",
        images: [
            "https://cdn.shopify.com/s/files/1/0737/1305/7844/files/01_891968c4-abe8-4e74-b94f-e714c8f28a8d.jpg?v=1764056468"
        ],
        tags: ["Diwali Decoration", "Home Decor"]
    },
    {
        handle: "3d-creative-writeable-led-night-lamp-with-pen-and-usb-cable",
        title: "3D Creative Writeable LED Night Lamp with Pen and USB Cable",
        descriptionHtml: "<p>Custom Message Acrylic Board Light with Erasable Marker. Personalized Home Decor Lamp & Romantic Gift.</p>",
        productType: "Home Improvement",
        vendor: "WGM",
        price: "699.00",
        compareAtPrice: "182.00",
        sku: "whl175_68455_797_3",
        images: [
            "https://cdn.shopify.com/s/files/1/0737/1305/7844/files/3QeZB7RkRj.png?v=1764056470"
        ],
        tags: ["3D Lamp", "Gift", "Gift Product", "Lamp"]
    },
    {
        handle: "3d-crystal-ganesha-led-night-lamp",
        title: "3D Crystal Ganesha LED Night Lamp with Wooden Base",
        descriptionHtml: "<p>Creative Engraved Crystal Ball Night Light, USB Table LED Wooden Crystal Ball for Home Office Decoration Birthday Gift.</p>",
        productType: "Gift",
        vendor: "WGM",
        price: "599.00",
        compareAtPrice: "160.00",
        sku: "whl175_50219_g1",
        images: [
            "https://cdn.shopify.com/s/files/1/0737/1305/7844/files/NOPIrEaXzm.png?v=1764056471"
        ],
        tags: ["Best Selling", "Gift", "Gift Products", "Showpiece Gift"]
    },
    {
        handle: "3d-crystal-shiva-led-night-lamp",
        title: "3D Crystal Glass Shiva Sculpture LED Night Lamp with Wooden Base",
        descriptionHtml: "<p>Illuminated Adiyogi Bust Decorative Light for Meditation, Spiritual Home Décor, and Gift Purposes.</p>",
        productType: "Gift",
        vendor: "WGM",
        price: "875.00",
        compareAtPrice: "160.00",
        sku: "whl175_50222_rj_1482_adi",
        images: [
            "https://cdn.shopify.com/s/files/1/0737/1305/7844/files/nokiUdoO8j.jpg?v=1764056471"
        ],
        tags: ["Gift", "Lamp", "Showpiece Gift"]
    },
    {
        handle: "3d-deer-in-forest-scene-crystal-glass-led-night-lamp",
        title: "3D Deer in Forest Scene Crystal Glass LED Night Lamp with Wooden Frame",
        descriptionHtml: "<p>USB Powered Table Light with Warm Yellow Glow. Nature-Inspired Bedroom Decor & Gift for Animal Lovers.</p>",
        productType: "Gift",
        vendor: "WGM",
        price: "899.00",
        compareAtPrice: "286.00",
        sku: "whl175_66799_e_180",
        images: [
            "https://cdn.shopify.com/s/files/1/0737/1305/7844/files/vZWnJaXkQ3.jpg?v=1764056472"
        ],
        tags: ["Gift", "Gift Products", "Showpiece Gift"]
    },
    {
        handle: "astronaut-crystal-ball-led-night-light",
        title: "3D Engraved Crystal Astronaut LED Night Lamp with Wooden Base",
        descriptionHtml: "<p>Space-Themed Decorative Light for Kids' Rooms, Desks, and Gifts. Warm White Ambient Lighting for Space Enthusiasts.</p>",
        productType: "Gift",
        vendor: "WGM",
        price: "599.00",
        compareAtPrice: "160.00",
        sku: "whl175_50210_rj_1482_k",
        images: [
            "https://cdn.shopify.com/s/files/1/0737/1305/7844/files/RFUDyyLEPz.jpg?v=1764056473"
        ],
        tags: ["Gift", "Lamp", "Showpiece Gift"]
    },
    {
        handle: "radha-krishna-swing-of-dreams-crystal-globe",
        title: "3D Engraved Crystal Ball LED Night Lamp with Romantic Couple on Swing",
        descriptionHtml: "<p>Warm Light Decorative Showpiece on Wooden Base. Unique Valentine's, Anniversary, or Wedding Gift.</p>",
        productType: "Gift",
        vendor: "WGM",
        price: "499.00",
        compareAtPrice: "160.00",
        sku: "whl175_50213_rj_1482_rkjhula",
        images: [
            "https://cdn.shopify.com/s/files/1/0737/1305/7844/files/OepM1xDryu.jpg?v=1764056474"
        ],
        tags: ["Gift", "Gift Products", "Lamp", "Showpiece Gift"]
    },
    {
        handle: "3d-illusion-geometric-vase-shape-led-table-lamp",
        title: "3D Illusion Geometric Vase Shape LED Table Lamp with Touch Control",
        descriptionHtml: "<p>Dual Color Warm White & Golden Glow Night Light for Bedroom, Living Room, Office & Modern Home Décor.</p>",
        productType: "Gift",
        vendor: "WGM",
        price: "999.00",
        compareAtPrice: "1074.00",
        sku: "whl175_68330_rj_2141_c",
        images: [
            "https://cdn.shopify.com/s/files/1/0737/1305/7844/files/DNvvG3flPf.png?v=1764056476"
        ],
        tags: ["Gift", "Gift Product", "Lamp", "Lamps"]
    },
    {
        handle: "3d-illusion-led-night-lamp-with-football-player-design",
        title: "3D Illusion LED Night Lamp with Football Player Design",
        descriptionHtml: "<p>3D illusion LED lamp featuring football player design.</p>",
        productType: "Home Decor",
        vendor: "DeoDap",
        price: "799.00",
        compareAtPrice: "299.00",
        sku: "14887_3d_illusion_led_light_lamp_no6",
        images: [
            "https://cdn.shopify.com/s/files/1/0737/1305/7844/files/01_57eefd48-cb08-421d-aaf3-647db4e8340a.jpg?v=1764056475"
        ],
        tags: ["Birthday Gift", "Decorative Light", "Gift", "Home Decor"]
    },
    {
        handle: "3d-illusion-led-night-lamp-with-gaming-controller-design",
        title: "3D Illusion LED Night Lamp with Gaming Controller Design",
        descriptionHtml: "<p>3D illusion LED lamp featuring gaming controller design.</p>",
        productType: "Home Decor",
        vendor: "shopwave",
        price: "659.00",
        compareAtPrice: "299.00",
        sku: "14883_3d_illusion_led_night_lamp_no8",
        images: [
            "https://cdn.shopify.com/s/files/1/0737/1305/7844/files/01_3bd34d0d-c930-4331-a3a0-7e332d90c752.jpg?v=1764056476"
        ],
        tags: ["Birthday Gift", "Decorative Light", "Gift", "Home Decor"]
    },
    {
        handle: "3d-illusion-led-night-lamp-with-heart-and-best-friend-design",
        title: "3D Illusion LED Night Lamp with Heart and Best Friend Design",
        descriptionHtml: "<p>3D illusion LED lamp with heart and best friend themed design.</p>",
        productType: "Home Decor",
        vendor: "DeoDap",
        price: "687.00",
        compareAtPrice: "299.00",
        sku: "14886_3d_illusion_led_night_lamp_no5",
        images: [
            "https://cdn.shopify.com/s/files/1/0737/1305/7844/files/1_3eb9ea6d-f476-4733-bedb-582dd17cd3a8.jpg?v=1764056477"
        ],
        tags: ["Birthday Gift", "Decorative Light", "Gift", "Home Decor"]
    },
    {
        handle: "3d-illusion-led-night-lamp-with-house-and-balloons-design",
        title: "3D Illusion LED Night Lamp with House and Balloons Design",
        descriptionHtml: "<p>3D illusion LED lamp with house and balloons design.</p>",
        productType: "Home Decor",
        vendor: "DeoDap",
        price: "789.00",
        compareAtPrice: "299.00",
        sku: "14882_3d_illusion_led_night_lamp_no2",
        images: [
            "https://cdn.shopify.com/s/files/1/0737/1305/7844/files/1_35f939d6-d554-4689-81c2-39894e552594.jpg?v=1764056477"
        ],
        tags: ["Birthday Gift", "Decorative Light", "Gift", "Home Decor"]
    },
    {
        handle: "3d-illusion-led-night-lamp-with-teddy-bear-holding-heart-design",
        title: "3D Illusion LED Night Lamp with Teddy Bear Holding Heart Design",
        descriptionHtml: "<p>3D illusion LED lamp with teddy bear holding heart design.</p>",
        productType: "Home Decor",
        vendor: "DeoDap",
        price: "799.00",
        compareAtPrice: "299.00",
        sku: "14884_3d_illusion_led_light_lamp_no9",
        images: [
            "https://cdn.shopify.com/s/files/1/0737/1305/7844/files/1_85975d5d-5338-4998-be63-779a13121c90.jpg?v=1764056478"
        ],
        tags: ["Birthday Gift", "Decorative Light", "Gift", "Home Decor"]
    },
    {
        handle: "3d-illusion-multicolor-changing-led-night-lamp-with-cat-design",
        title: "3D Illusion Multicolor Changing LED Night Lamp with Cat Design",
        descriptionHtml: "<p>Multicolor changing 3D illusion LED lamp with cat design.</p>",
        productType: "Home Decor",
        vendor: "DeoDap",
        price: "729.00",
        compareAtPrice: "299.00",
        sku: "14888_3d_illusion_led_light_lamp_no7",
        images: [
            "https://cdn.shopify.com/s/files/1/0737/1305/7844/files/1_5a22f318-1695-4c04-a0ae-c1cf896a4c3e.jpg?v=1764056479"
        ],
        tags: ["Birthday Gift", "Decorative Light", "Gift", "Home Decor"]
    },
    {
        handle: "3d-led-acrylic-writing-board-with-calendar-design",
        title: "3D LED Acrylic Writing Board with Calendar Design",
        descriptionHtml: "<p>Reusable Message Lamp with Erasable Pen & USB Cable. Custom Note Night Light for Study Table, Office Desk & Gift.</p>",
        productType: "Home Improvement",
        vendor: "WGM",
        price: "859.00",
        compareAtPrice: "182.00",
        sku: "whl175_68456_797_1",
        images: [
            "https://cdn.shopify.com/s/files/1/0737/1305/7844/files/KqbCodkfxp.png?v=1764056481"
        ],
        tags: ["Acrylic Writing Board", "Gift", "Gift Product", "Lamp", "LED Lamp"]
    },
    {
        handle: "3d-moon-led-night-lamp-with-wooden-base",
        title: "3D Moon LED Night Lamp with Wooden Base",
        descriptionHtml: "<p>Laser Engraved Full Moon Acrylic Light for Bedroom, Home Decor, Desk & Gifting. Lunar Glow Ambient Lamp with USB Power.</p>",
        productType: "Gift",
        vendor: "WGM",
        price: "499.00",
        compareAtPrice: "218.00",
        sku: "whl175_66811_g_150",
        images: [
            "https://cdn.shopify.com/s/files/1/0737/1305/7844/files/2fT3NQ6WqI.jpg?v=1764056481"
        ],
        tags: ["Gift", "Gift Product", "Lamp", "Showpiece Gift"]
    },
    {
        handle: "3d-pyramid-puzzle-toy-1-set",
        title: "3D Pyramid Puzzle Toy (1 Set)",
        descriptionHtml: "<p>Pyramid puzzle toy set for learning and fun.</p>",
        productType: "Toys & Games",
        vendor: "Aditi",
        price: "399.00",
        compareAtPrice: "49.00",
        sku: "19639_2_parts_pyramid_puzzle_atp140",
        images: [
            "https://cdn.shopify.com/s/files/1/0737/1305/7844/files/Pyramid-Puzzle-01.jpg?v=1764056481"
        ],
        tags: ["Learning Toys", "Puzzle", "Toys & Games", "Toys For Kids"]
    },
    {
        handle: "lovelit-romance-frame",
        title: "3D Romantic Couple Figurine Shadow Box with LED Lights and Photoframe",
        descriptionHtml: "<p>I Love You Wooden Frame for Valentine's Day, Proposal, Wedding Anniversary, or Bedroom Decoration.</p>",
        productType: "Gift",
        vendor: "WGM",
        price: "757.00",
        compareAtPrice: "780.00",
        sku: "whl175_50346_rj_2101_8",
        images: [
            "https://cdn.shopify.com/s/files/1/0737/1305/7844/files/EvZdG7kZXw.jpg?v=1764056482"
        ],
        tags: ["Gift", "Gift Products", "Love", "Showpiece Gift"]
    },
    {
        handle: "18282_3d_space_round_carpet_1pc",
        title: "3D Space Round Carpet, Floor Mat Non-Woven Doormat (1 Pc / 78 Cm)",
        descriptionHtml: "<p>Space-themed round carpet for floor decoration.</p>",
        productType: "Home Improvement",
        vendor: "Deodap",
        price: "749.00",
        compareAtPrice: "699.00",
        sku: "18282_3d_space_round_carpet_1pc",
        images: [
            "https://cdn.shopify.com/s/files/1/0737/1305/7844/files/02_241f9c7d-5146-4156-909f-e5721afdc14a.jpg?v=1764056482"
        ],
        tags: ["Decorative Accessories", "Doormat", "Home & Kitchen"]
    },
    {
        handle: "3d-space-round-carpet-floor-mat-non-woven-doormat-80-cm",
        title: "3D Space Round Carpet, Floor Mat Non-Woven Doormat (60 Cm)",
        descriptionHtml: "<p>Space-themed round carpet, 60cm diameter.</p>",
        productType: "Home Improvement",
        vendor: "DeoDap",
        price: "756.00",
        compareAtPrice: "599.00",
        sku: "17631_3d_space_round_carpet_60cm_1pc",
        images: [
            "https://cdn.shopify.com/s/files/1/0737/1305/7844/files/CarpetRound-WOSKU-01.jpg?v=1764056483"
        ],
        tags: ["Bathroom Accessories", "Doormat", "Home Decor", "Home Improvement"]
    },
    {
        handle: "12837_3d_virtual_reality_box_1pc",
        title: "3D VR Box Headset Compatible with iPhone & Android",
        descriptionHtml: "<p>Virtual Reality VR Goggles for 3D VR Movies Video Games.</p>",
        productType: "Electronics",
        vendor: "DeoDap",
        price: "2249.00",
        compareAtPrice: "699.00",
        sku: "12837_3d_virtual_reality_box_1pc",
        images: [
            "https://cdn.shopify.com/s/files/1/0737/1305/7844/files/01_608e9644-b389-4ba1-9570-2c212dd8680a.jpg?v=1764056484"
        ],
        tags: ["Best Selling", "Birthday Gift", "Gift", "Mobile Accessories", "VR Box", "Viral Gadget"]
    },
    {
        handle: "3in1-wall-mounted-multi-compartment-toothbrush-soap-holder-with-cup-1-pc",
        title: "3in1 Wall Mounted Multi-Compartment Toothbrush & Soap Holder with Cup (1 Pc)",
        descriptionHtml: "<p>Wall mounted bathroom organizer with toothbrush holder, soap holder, and cup.</p>",
        productType: "Health & Beauty Accessories",
        vendor: "DeoDap",
        price: "789.00",
        compareAtPrice: "99.00",
        sku: "19621_3in1_bathroom_storage_organizer",
        images: [
            "https://cdn.shopify.com/s/files/1/0737/1305/7844/files/TuthbrushHolder-WOSKU-01.jpg?v=1764056485"
        ],
        tags: ["Bathroom Accessories", "Health & Beauty Accessories", "Home Improvement", "Toothbrush Holder"]
    },
    {
        handle: "4-in-1-wall-mounted-bathroom-organizer-1-pc",
        title: "4 in 1 Wall-Mounted Bathroom Organizer - (1 Pc)",
        descriptionHtml: "<p>4-in-1 wall mounted bathroom organizer for efficient storage.</p>",
        productType: "Home Improvement",
        vendor: "DeoDap",
        price: "559.00",
        compareAtPrice: "125.00",
        sku: "19863_4_in_1_bathroom_organizer",
        images: [
            "https://cdn.shopify.com/s/files/1/0737/1305/7844/files/TuthbrushHolder2-WOSKU-01.jpg?v=1764056486"
        ],
        tags: ["Bathroom Accessories", "Bathroom Organizer", "Home Improvement"]
    },
    {
        handle: "4-layer-round-metal-mesh-storage-organizer-rack-with-wheels-1-pc",
        title: "4-Layer Round Metal Folding Storage Trolley with Mesh Baskets and Wheels",
        descriptionHtml: "<p>Multi-Purpose Organizer Rack for kitchen, bathroom, and home storage.</p>",
        productType: "Home Improvement",
        vendor: "Organivo",
        price: "1199.00",
        compareAtPrice: "3999.00",
        sku: "19480_4tier_kitchen_storage_trolley_1pc",
        images: [
            "https://cdn.shopify.com/s/files/1/0737/1305/7844/files/03_e57fc866-3023-4563-b45d-ca390f8a11e2.jpg?v=1764056487"
        ],
        tags: ["Home & Kitchen", "Home Improvement", "Kitchen Tools"]
    },
    {
        handle: "15842_45mm_tape_cutter_1pc",
        title: "45mm Hand Tape Dispenser Packing Packaging Boxes Roll Roller Cutter",
        descriptionHtml: "<p>Hand tape dispenser for packaging and packing boxes.</p>",
        productType: "Office Products",
        vendor: "TapeHub",
        price: "493.00",
        compareAtPrice: "149.00",
        sku: "15842_45mm_tape_cutter_1pc",
        images: [
            "https://cdn.shopify.com/s/files/1/0737/1305/7844/files/Tape-Dispenser-01.jpg?v=1764056488"
        ],
        tags: ["Office Supply", "Stationery", "Tape Dispenser"]
    },
    {
        handle: "metal-feng-shui-vastu-wind-chime-for-positive-vibrations",
        title: "6 Bell House Decorative Hanging Wind Chimes for Home Positive Energy",
        descriptionHtml: "<p>Wind Chimes for Home Balcony Windows Bedroom Living Room Garden Hanging Indoor Outdoor Decoration with Sweet Sound (24 inch).</p>",
        productType: "Garden & Outdoors",
        vendor: "EP",
        price: "469.00",
        compareAtPrice: "399.00",
        sku: "whl186_49103_wind_chimes_2step_100400",
        images: [
            "https://cdn.shopify.com/s/files/1/0737/1305/7844/files/QSBCciDxzl.jpg?v=1764056489"
        ],
        tags: ["Decoration", "Garden & Outdoor", "Wind Chime", "Wind Chimes"]
    },
    {
        handle: "6-in1-manicure-pedicure-grooming-kit",
        title: "6 in1 Manicure & Pedicure Grooming Kit",
        descriptionHtml: "<p>Complete manicure and pedicure grooming kit with 6 essential tools.</p>",
        productType: "Health & Beauty Accessories",
        vendor: "DeoDap",
        price: "499.00",
        compareAtPrice: "199.00",
        sku: "12522_6in1_manicure_n_pedicure_grooming_kit",
        images: [
            "https://cdn.shopify.com/s/files/1/0737/1305/7844/files/Manicure-set-01.jpg?v=1764056491"
        ],
        tags: ["Health & Beauty", "Health & Beauty Accessories", "Manicure & Pedicure", "Nail Accessories"]
    },
    {
        handle: "6-compartment-wardrobe-organizer-pack-of-4",
        title: "6-Compartment Wardrobe Organizer pack of 4",
        descriptionHtml: "<p>Pack of 4 wardrobe organizers with 6 compartments each.</p>",
        productType: "Home Improvement",
        vendor: "HK",
        price: "683.00",
        compareAtPrice: "499.00",
        sku: "whl193_66535_6_compartment_wardrobe_organizer_pack_of_4",
        images: [
            "https://cdn.shopify.com/s/files/1/0737/1305/7844/files/74YwpktgEX.jpg?v=1764056492"
        ],
        tags: ["Compartment Organizer", "Drawer Organizer", "Home Improvement", "Storage Box"]
    }
];

// Get products by type for collections
export function getProductsByType(type: string): ProductData[] {
    return PRODUCTS.filter(p => p.productType.toLowerCase() === type.toLowerCase());
}

// Get all unique product types
export function getProductTypes(): string[] {
    return [...new Set(PRODUCTS.map(p => p.productType))];
}
