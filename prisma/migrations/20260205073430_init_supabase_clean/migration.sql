-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "scope" TEXT,
    "expires" TIMESTAMP(3),
    "accessToken" TEXT NOT NULL,
    "userId" BIGINT,
    "firstName" TEXT,
    "lastName" TEXT,
    "email" TEXT,
    "accountOwner" BOOLEAN NOT NULL DEFAULT false,
    "locale" TEXT,
    "collaborator" BOOLEAN DEFAULT false,
    "emailVerified" BOOLEAN DEFAULT false,
    "refreshToken" TEXT,
    "refreshTokenExpires" TIMESTAMP(3),

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WidgetSettings" (
    "id" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "whatsappEnabled" BOOLEAN NOT NULL DEFAULT false,
    "whatsappNumber" TEXT,
    "whatsappPosition" TEXT NOT NULL DEFAULT 'bottom-right',
    "whatsappColor" TEXT NOT NULL DEFAULT '#25D366',
    "whatsappSize" TEXT NOT NULL DEFAULT 'medium',
    "whatsappTooltip" TEXT NOT NULL DEFAULT 'Chat with us!',
    "whatsappShowTooltip" BOOLEAN NOT NULL DEFAULT true,
    "notificationEnabled" BOOLEAN NOT NULL DEFAULT false,
    "notificationPosition" TEXT NOT NULL DEFAULT 'bottom-left',
    "notificationBgColor" TEXT NOT NULL DEFAULT '#ffffff',
    "notificationTextColor" TEXT NOT NULL DEFAULT '#333333',
    "notificationAccentColor" TEXT NOT NULL DEFAULT '#25D366',
    "notificationCtaText" TEXT NOT NULL DEFAULT 'Trending Now',
    "notificationTimeText" TEXT NOT NULL DEFAULT 'Just now',
    "notificationInterval" INTEGER NOT NULL DEFAULT 8,
    "notificationDuration" INTEGER NOT NULL DEFAULT 5,
    "notificationDelay" INTEGER NOT NULL DEFAULT 3,
    "notificationProducts" TEXT,
    "notificationDisplayLogic" TEXT NOT NULL DEFAULT 'random',
    "notificationThemeColor" TEXT NOT NULL DEFAULT '#ef4444',
    "notificationSize" TEXT NOT NULL DEFAULT 'medium',
    "eddEnabled" BOOLEAN NOT NULL DEFAULT false,
    "eddMinHandlingDays" INTEGER NOT NULL DEFAULT 1,
    "eddMaxHandlingDays" INTEGER NOT NULL DEFAULT 3,
    "eddMinShippingDays" INTEGER NOT NULL DEFAULT 7,
    "eddMaxShippingDays" INTEGER NOT NULL DEFAULT 12,
    "eddCutoffHour" INTEGER NOT NULL DEFAULT 17,
    "eddShowTimeline" BOOLEAN NOT NULL DEFAULT true,
    "eddPosition" TEXT NOT NULL DEFAULT 'below-atc',
    "eddBgColor" TEXT NOT NULL DEFAULT '#f0fdf4',
    "eddTextColor" TEXT NOT NULL DEFAULT '#166534',
    "eddAccentColor" TEXT NOT NULL DEFAULT '#22c55e',
    "eddMessageTemplate" TEXT NOT NULL DEFAULT 'Order within {time_left} to get it by {delivery_date}',
    "eddThemeColor" TEXT NOT NULL DEFAULT '#000000',
    "eddCustomText" TEXT NOT NULL DEFAULT 'Order within',
    "eddCountry" TEXT NOT NULL DEFAULT 'IN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WidgetSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WidgetSettings_shop_key" ON "WidgetSettings"("shop");
