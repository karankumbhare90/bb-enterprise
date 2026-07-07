import mongoose from "mongoose";

async function run() {
  const uri = "mongodb+srv://bbenterpriseglobal_db_user:JtvGEeCLw0GesOqW@cluster0.wramy7y.mongodb.net/bb-enterprise?appName=Cluster0";
  await mongoose.connect(uri);
  
  const db = mongoose.connection.db;
  if (!db) return;
  
  const category = await db.collection("categories").findOne();
  console.log("Category from DB:", category);
  
  // Actually update them here!
  const categories = await db.collection("categories").find().toArray();
  for (const cat of categories) {
      if (!cat.slug) {
          const base = cat.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
          const slug = base || "category-" + Date.now();
          await db.collection("categories").updateOne({ _id: cat._id }, { $set: { slug } });
      }
  }

  const products = await db.collection("products").find().toArray();
  for (const prod of products) {
      if (!prod.slug) {
          const base = prod.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
          const slug = base || "product-" + Date.now();
          await db.collection("products").updateOne({ _id: prod._id }, { $set: { slug } });
      }
  }
  
  console.log("Direct update complete!");

  mongoose.connection.close();
}
run();
