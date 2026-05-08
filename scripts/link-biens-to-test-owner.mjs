// Links the 2 Cotonou/Akogbato biens to the test owner account
// Test owner ID: ctest-owner-1776734788773
import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });

const sql = neon(process.env.DATABASE_URL);

const TEST_OWNER_ID = "ctest-owner-1776734788773";
const SLUGS = [
  "appartement-meuble-teta-2-chambres-akogbato-cotonou",
  "appartement-meuble-tedji-akogbato-cotonou",
];

async function main() {
  for (const slug of SLUGS) {
    const rows = await sql`
      UPDATE "Property"
      SET    "ownerId" = ${TEST_OWNER_ID}
      WHERE  slug = ${slug}
      RETURNING id, title, slug
    `;
    if (rows.length === 0) {
      console.warn(`[WARN] Not found: ${slug}`);
    } else {
      console.log(`[OK] Linked: ${rows[0].title} (${rows[0].id})`);
    }
  }
  console.log("Done.");
}

main().catch((err) => { console.error(err); process.exit(1); });
