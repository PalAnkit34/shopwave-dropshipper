import type { ActionFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";

// Simplified widget snippets
const WHATSAPP_SNIPPET = `{%- comment -%}WhatsApp Chat Widget by Social Boost{%- endcomment -%}
{%- if settings.whatsapp_enabled -%}
<style>
.sb-wa{position:fixed;bottom:20px;z-index:9999}
.sb-wa.right{right:20px}
.sb-wa.left{left:20px}
.sb-wa a{display:flex;align-items:center;justify-content:center;width:60px;height:60px;background:{{ settings.whatsapp_color | default:'#25D366' }};border-radius:50%;box-shadow:0 4px 15px rgba(0,0,0,.2);transition:.3s}
.sb-wa a:hover{transform:scale(1.1)}
.sb-wa svg{width:32px;height:32px;fill:#fff}
</style>
<div class="sb-wa {{ settings.whatsapp_position | default:'right' }}">
<a href="https://wa.me/{{ settings.whatsapp_number | remove:'+' | remove:' ' }}" target="_blank" aria-label="Chat on WhatsApp">
<svg viewBox="0 0 32 32"><path d="M16 0C7.2 0 0 7.2 0 16c0 2.8.7 5.5 2.1 7.9L0 32l8.3-2.2c2.3 1.2 4.9 1.9 7.7 1.9 8.8 0 16-7.2 16-16S24.8 0 16 0zm8 22.8c-.3.9-1.8 1.7-2.5 1.8-.7.1-1.3.5-4.5-.9-3.8-1.7-6.2-5.5-6.4-5.8-.2-.3-1.5-2-1.5-3.8s.9-2.7 1.3-3c.3-.4.7-.5 1-.5h.7c.2 0 .5 0 .8.6.3.7 1 2.4 1.1 2.6.1.2.1.4 0 .6-.1.2-.2.4-.4.6l-.6.6c-.2.2-.4.4-.2.7.3.4.9 1.4 1.9 2.3 1.3 1.2 2.4 1.5 2.7 1.7.3.2.5.1.7-.1l1-1.2c.3-.3.5-.3.8-.2.3.1 1.9.9 2.2 1.1.3.2.5.2.6.4.1.1.1.8-.2 1.5z"/></svg>
</a>
</div>
{%- endif -%}`;

const NOTIFICATION_SNIPPET = `{%- comment -%}Sales Notification by Social Boost{%- endcomment -%}
{%- if settings.notification_enabled -%}
<style>
.sb-notif{position:fixed;bottom:20px;left:20px;z-index:9998;max-width:300px;opacity:0;transform:translateY(20px);transition:.4s;pointer-events:none}
.sb-notif.show{opacity:1;transform:translateY(0);pointer-events:auto}
.sb-notif-inner{display:flex;gap:10px;padding:10px;background:{{ settings.notification_bg | default:'#fff' }};border-radius:10px;box-shadow:0 5px 25px rgba(0,0,0,.15)}
.sb-notif img{width:50px;height:50px;border-radius:6px;object-fit:cover}
.sb-notif-text{flex:1}
.sb-notif-cta{font-size:10px;font-weight:700;text-transform:uppercase;color:{{ settings.notification_accent | default:'#25D366' }}}
.sb-notif-name{display:block;font-size:13px;font-weight:500;color:{{ settings.notification_text | default:'#333' }};margin:2px 0}
.sb-notif-time{font-size:11px;color:#888}
.sb-notif-close{position:absolute;top:-6px;right:-6px;width:20px;height:20px;background:#fff;border:1px solid #ddd;border-radius:50%;font-size:14px;cursor:pointer;line-height:18px}
</style>
<div class="sb-notif" id="sbNotif">
<div class="sb-notif-inner">
<img id="sbImg" src="" alt="">
<div class="sb-notif-text">
<span class="sb-notif-cta">{{ settings.notification_cta | default:'Trending Now' }}</span>
<span class="sb-notif-name" id="sbName"></span>
<span class="sb-notif-time">{{ settings.notification_time | default:'Just now' }}</span>
</div>
<button class="sb-notif-close" onclick="document.getElementById('sbNotif').classList.remove('show')">&times;</button>
</div>
</div>
<script>
(function(){var p=[],n=document.getElementById('sbNotif'),i=0;
{%- for product in collections.all.products limit:6 -%}
{%- if product.featured_image -%}
p.push({n:"{{ product.title | escape }}",i:"{{ product.featured_image | image_url: width:100 }}"});
{%- endif -%}
{%- endfor -%}
if(p.length){function s(){var x=p[i];document.getElementById('sbImg').src=x.i;document.getElementById('sbName').textContent=x.n;n.classList.add('show');setTimeout(function(){n.classList.remove('show');i=(i+1)%p.length},4000)}setTimeout(function(){s();setInterval(s,9000)},3000)}})();
</script>
{%- endif -%}`;

const SETTINGS_SCHEMA = [
  {
    "name": "WhatsApp Widget", "settings": [
      { "type": "header", "content": "WhatsApp Chat Button" },
      { "type": "checkbox", "id": "whatsapp_enabled", "label": "Enable WhatsApp", "default": true },
      { "type": "text", "id": "whatsapp_number", "label": "Phone Number", "info": "With country code" },
      { "type": "select", "id": "whatsapp_position", "label": "Position", "options": [{ "value": "right", "label": "Bottom Right" }, { "value": "left", "label": "Bottom Left" }], "default": "right" },
      { "type": "color", "id": "whatsapp_color", "label": "Color", "default": "#25D366" }
    ]
  },
  {
    "name": "Sales Notifications", "settings": [
      { "type": "header", "content": "Social Proof" },
      { "type": "checkbox", "id": "notification_enabled", "label": "Enable Notifications", "default": true },
      { "type": "text", "id": "notification_cta", "label": "CTA Text", "default": "Trending Now" },
      { "type": "text", "id": "notification_time", "label": "Time Text", "default": "Just now" },
      { "type": "color", "id": "notification_bg", "label": "Background", "default": "#ffffff" },
      { "type": "color", "id": "notification_text", "label": "Text Color", "default": "#333333" },
      { "type": "color", "id": "notification_accent", "label": "Accent", "default": "#25D366" }
    ]
  }
];

async function upsertThemeFile(admin: any, themeId: string, filename: string, content: string) {
  const response = await admin.graphql(`
    mutation themeFilesUpsert($themeId: ID!, $files: [OnlineStoreThemeFilesUpsertFileInput!]!) {
      themeFilesUpsert(themeId: $themeId, files: $files) {
        upsertedThemeFiles { filename }
        userErrors { field message }
      }
    }
  `, {
    variables: {
      themeId,
      files: [{ filename, body: { type: "TEXT", value: content } }]
    }
  });

  const data = await response.json();
  const errors = data.data?.themeFilesUpsert?.userErrors;

  if (errors && errors.length > 0) {
    throw new Error(errors.map((e: any) => e.message).join(', '));
  }

  return data;
}

async function getThemeFile(admin: any, themeId: string, filename: string) {
  const response = await admin.graphql(`
    query getThemeFile($themeId: ID!) {
      theme(id: $themeId) {
        files(first: 1, filenames: ["${filename}"]) {
          nodes {
            filename
            body {
              ... on OnlineStoreThemeFileBodyText { content }
            }
          }
        }
      }
    }
  `, { variables: { themeId } });

  const data = await response.json();
  return data.data?.theme?.files?.nodes?.[0]?.body?.content || null;
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin } = await authenticate.admin(request);
  const results: string[] = [];

  try {
    // Get main theme
    const themesRes = await admin.graphql(`
      query { themes(first: 5, roles: [MAIN]) { nodes { id name role } } }
    `);

    const themesData = await themesRes.json();

    if ((themesData as any).errors) {
      return {
        success: false,
        error: "Access denied. Please reinstall the app to grant theme permissions.",
        details: (themesData as any).errors
      };
    }

    const mainTheme = themesData.data?.themes?.nodes?.[0];
    if (!mainTheme) {
      return { success: false, error: "No main theme found" };
    }

    results.push(`📦 Theme: ${mainTheme.name}`);

    // Create snippets
    try {
      await upsertThemeFile(admin, mainTheme.id, "snippets/whatsapp-widget.liquid", WHATSAPP_SNIPPET);
      results.push("✅ WhatsApp widget added");
    } catch (e: any) {
      results.push(`⚠️ WhatsApp: ${e.message}`);
    }

    try {
      await upsertThemeFile(admin, mainTheme.id, "snippets/sales-notification.liquid", NOTIFICATION_SNIPPET);
      results.push("✅ Sales notification added");
    } catch (e: any) {
      results.push(`⚠️ Notification: ${e.message}`);
    }

    // Update theme.liquid
    try {
      const layout = await getThemeFile(admin, mainTheme.id, "layout/theme.liquid");
      if (layout && !layout.includes("whatsapp-widget")) {
        const code = "\n{% render 'whatsapp-widget' %}\n{% render 'sales-notification' %}\n";
        const updated = layout.replace("</body>", code + "</body>");
        await upsertThemeFile(admin, mainTheme.id, "layout/theme.liquid", updated);
        results.push("✅ theme.liquid updated");
      } else {
        results.push("ℹ️ Widgets already in theme");
      }
    } catch (e: any) {
      results.push(`⚠️ Layout: ${e.message}`);
    }

    // Update settings schema
    try {
      const schema = await getThemeFile(admin, mainTheme.id, "config/settings_schema.json");
      if (schema) {
        const parsed = JSON.parse(schema);
        let updated = false;

        if (!parsed.some((s: any) => s.name === "WhatsApp Widget")) {
          parsed.push(SETTINGS_SCHEMA[0]);
          updated = true;
        }
        if (!parsed.some((s: any) => s.name === "Sales Notifications")) {
          parsed.push(SETTINGS_SCHEMA[1]);
          updated = true;
        }

        if (updated) {
          await upsertThemeFile(admin, mainTheme.id, "config/settings_schema.json", JSON.stringify(parsed, null, 2));
          results.push("✅ Settings schema updated");
        } else {
          results.push("ℹ️ Settings already exist");
        }
      }
    } catch (e: any) {
      results.push(`⚠️ Schema: ${e.message}`);
    }

    return {
      success: results.some(r => r.includes("✅")),
      message: "Installation complete!",
      themeName: mainTheme.name,
      results
    };

  } catch (error: any) {
    console.error("Theme injection error:", error);
    return {
      success: false,
      error: error.message || "Installation failed",
      results
    };
  }
};
