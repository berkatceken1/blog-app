const express = require("express");
const router = express.Router();

const db = require("../data/db");

router.get("/blog/delete/:blogid", async function(req, res) {
    const blogid = req.params.blogid;
    try {
        const [blogs, ] = await db.execute("select * from blog where blogid=?", [blogid]);
        const blog = blogs[0];

        res.render("admin/blog-delete", {
            title: "delete blog",
            blog: blog
        });
    } 
    catch (err) {
        console.log(err);
    }
});

router.post("/blog/delete/:blogid", async function(req, res) {
    const blogid = req.body.blogid;
    try {
        await db.execute("delete from blog where blogid=?", [blogid]);
        res.redirect("/admin/blogs");
    } catch (err) {
        console.log(err);
    }
});

router.get("/blog/create", async function(req, res){
    try {
        const [categories, ] =  await db.execute("select * from category");

        res.render("admin/blog-create", {
            title: "add blog",
            categories: categories
        });
    }
    catch(err) {
        console.log(err);
    }
});

router.post("/blog/create", async function(req, res) {
    const baslik = req.body.baslik;
    const aciklama = req.body.aciklama;
    const resim = req.body.resim;
    const kategori = req.body.kategori;
    const anasayfa = req.body.anasayfa == "on" ? 1 : 0;
    const onay = req.body.onay == "on" ? 1 : 0;

    try {
        await db.execute("INSERT INTO blog(baslik, aciklama, resim, categoryid, anasayfa, onay) VALUES(?,?,?,?,?,?)", [baslik, aciklama, resim, kategori, anasayfa, onay]);
        res.redirect("/admin/blogs");
    }
    catch(err) {
        console.log(err);
    }
});

router.get("/blogs/:blogid", async function(req, res) {
    const blogid = req.params.blogid;
    try {
        const [blogs, ] = await db.execute("select * from blog where blogid=?", [blogid]);
        const [categories, ] = await db.execute("select * from category");
        const blog = blogs[0];

        if(blog) {

            return res.render("admin/blog-edit", {
                title: blog.baslik,
                blog: blog,
                categories: categories
            });
        }

        res.redirect("admin/blogs");

    }
    catch(err) {
        console.log(err);
    }
});

router.post("/blogs/:blogid", async function(req, res) {
    const blogid = req.body.blogid;
    const resim = req.body.resim;
    const baslik = req.body.baslik;
    const aciklama = req.body.aciklama;
    const anasayfa = req.body.anasayfa == "on" ? 1 : 0;
    const onay = req.body.onay == "on" ? 1 : 0;
    const kategoriid = req.body.kategori;

    try {
        await db.execute("UPDATE blog SET resim=?, baslik=?, aciklama=?, anasayfa=?, onay=?, categoryid=? WHERE blogid=?", [resim, baslik, aciklama, anasayfa, onay, kategoriid, blogid]);
        res.redirect("/admin/blogs");
        
    } catch (err) {
        console.log(err)
    }
})

router.get("/blogs", async function(req, res){
    try {
        const [blogs, ] = await db.execute("select blogid, baslik, resim from blog");
        res.render("admin/blog-list", {
            title: "blog list",
            blogs: blogs
        });
    }
    catch(err) {
        console.log(err);
    }
});

module.exports = router;