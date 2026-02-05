import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import db from "../db.server";

// GET: Fetch widget settings (can be called from storefront via app proxy)
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");

  // If shop is provided in query (app proxy), return public settings
  if (shop) {
    const settings = await db.widgetSettings.findUnique({
      where: { shop },
      select: {
        whatsappEnabled: true,
        whatsappNumber: true,
        whatsappPosition: true,
        whatsappColor: true,
        whatsappSize: true,
        whatsappTooltip: true,
        whatsappShowTooltip: true,
        notificationEnabled: true,
        notificationPosition: true,
        notificationBgColor: true,
        notificationTextColor: true,
        notificationAccentColor: true,
        notificationCtaText: true,
        notificationTimeText: true,
        notificationInterval: true,
        notificationDuration: true,
        notificationDelay: true,
        notificationProducts: true,
        notificationThemeColor: true,
        notificationSize: true,
        eddEnabled: true,
        eddMinHandlingDays: true,
        eddMaxHandlingDays: true,
        eddMinShippingDays: true,
        eddMaxShippingDays: true,
        eddCutoffHour: true,
        eddShowTimeline: true,
        eddCountry: true,
      },
    });

    return settings || getDefaultSettings();
  }

  // Otherwise, authenticate and return full settings
  const { session } = await authenticate.admin(request);

  let settings = await db.widgetSettings.findUnique({
    where: { shop: session.shop },
  });

  if (!settings) {
    settings = await db.widgetSettings.create({
      data: { shop: session.shop },
    });
  }

  return settings;
};

// POST: Save widget settings
export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const formData = await request.formData();

  const data: Record<string, any> = {};

  // Boolean fields
  const booleanFields = [
    "whatsappEnabled",
    "whatsappShowTooltip",
    "notificationEnabled",
    "eddEnabled",
    "eddShowTimeline",
  ];

  // String fields
  const stringFields = [
    "whatsappNumber",
    "whatsappPosition",
    "whatsappColor",
    "whatsappSize",
    "whatsappTooltip",
    "notificationPosition",
    "notificationBgColor",
    "notificationTextColor",
    "notificationAccentColor",
    "notificationCtaText",
    "notificationTimeText",
    "notificationProducts",
    "notificationThemeColor",
    "notificationSize",
    "eddCountry",
  ];

  // Integer fields
  const intFields = [
    "notificationInterval",
    "notificationDuration",
    "notificationDelay",
    "eddMinHandlingDays",
    "eddMaxHandlingDays",
    "eddMinShippingDays",
    "eddMaxShippingDays",
    "eddCutoffHour",
  ];

  booleanFields.forEach((field) => {
    const value = formData.get(field);
    if (value !== null) {
      data[field] = value === "true" || value === "on";
    }
  });

  stringFields.forEach((field) => {
    const value = formData.get(field);
    if (value !== null) {
      data[field] = value.toString();
    }
  });

  intFields.forEach((field) => {
    const value = formData.get(field);
    if (value !== null) {
      data[field] = parseInt(value.toString(), 10);
    }
  });

  const settings = await db.widgetSettings.upsert({
    where: { shop: session.shop },
    update: data,
    create: { shop: session.shop, ...data },
  });

  return { success: true, settings };
};

function getDefaultSettings() {
  return {
    whatsappEnabled: false,
    whatsappNumber: "",
    whatsappPosition: "bottom-right",
    whatsappColor: "#25D366",
    whatsappSize: "medium",
    whatsappTooltip: "Chat with us!",
    whatsappShowTooltip: true,
    notificationEnabled: false,
    notificationPosition: "bottom-left",
    notificationBgColor: "#ffffff",
    notificationTextColor: "#333333",
    notificationAccentColor: "#25D366",
    notificationCtaText: "Trending Now",
    notificationTimeText: "Just now",
    notificationInterval: 8,
    notificationDuration: 5,
    notificationDelay: 3,
    notificationProducts: null,
    notificationThemeColor: "#ef4444",
    notificationSize: "medium",
  };
}
