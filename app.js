var express=require("express"),
     app=express(),
     passport=require("passport"),
     mongoose=require("mongoose"),
     bodyParser=require("body-parser"),
     LocalStrategy=require("passport-local"),
     User  =require("./models/user"),
     passportLocalMongoose=require("passport-local-mongoose");
     
  mongoose.connect("mongodb://localhost:27017/auth_demo", { useNewUrlParser: true });
  
   app.set("view engine","ejs"); 
   app.use(bodyParser.urlencoded({extended:false}));
    
    
  app.use(require("express-session")({
      secret:" intenship to do",
      resave:false,
      saveUninitialized:false
      
      
  }));
   app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new LocalStrategy(User.authenticate()))
  passport.serializeUser(User.serializeUser());
   passport.deserializeUser(User.deserializeUser());
   
    
    app.get("/",function(req,res){
        res.render("home")
    })
    app.get("/secret",isLoggedin,function(req,res){
         res.render("secret");
        
    });
    //auth routes
    app.get("/register",function(req,res){
        res.render("register")
    })
    app.post("/register",function(req,res){
       req.body.username,
       req.body.email,
       req.body.password
       User.register(new User({username:req.body.username,email:req.body.email}),  req.body.password,function(err,user){
           if(err){
               console.log(err)
               return res.render("register")
           }
           passport.authenticate("local")(req,res,function(){
               res.redirect("/secret")
               
           })
           
       } )
        
    })
    //login page
    app.get("/login",function(req,res){
        res.render("login")
        
    })
    
    //middleware route
    app.post('/login',
  passport.authenticate('local', { successRedirect: '/secret',
                                   failureRedirect: '/login',
                                   }),function(req,res){}
);

//logout routes
app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/")
    
})

function isLoggedin(req,res,next){
    if(req.isAuthenticated()){
         return next()
    }
    res.redirect("/login")
}
    
    app.listen(process.env.PORT,process.env.IP,function(){
        console.log("server has started .......")
        
    })