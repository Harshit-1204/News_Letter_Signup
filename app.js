require("dotenv").config()
const express=require("express")
const app=express()
const bodyParser=require("body-parser")
const https=require("https")

app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended:true}))
app.get("/",function(req,res){
    res.sendFile(__dirname+"/signup.html")
    
})

app.post("/",function(req,res){
    var firstName=req.body.firstName
    var lastName=req.body.lastName
    var email=req.body.email

    const data={
        members:[
            {
            email_address:email,
            status:"subscribed",
            merge_fields:{
                FNAME:firstName,
                LNAME:lastName
            }
            
        }]
    }
    const jsonData=JSON.stringify(data)
    url="https://us1.api.mailchimp.com/3.0/lists/"+process.env.LIST_ID
    const option={
        method:"POST",
        auth:process.env.API_KEY,
        
    }

    const request=https.request(url,option,function(response){
        if(response.statusCode===200){
            res.sendFile(__dirname+"/success.html")
        }else{
            res.sendFile(__dirname+"/failure.html")
        }
        response.on("data",function(data){
            console.log(JSON.parse(data))
        })
    })
    request.write(jsonData)
    request.end()
})

app.post("/failure",function(req,res){
    res.redirect("/")
})

app.listen(process.env.PORT || 3000,function(){
    console.log("The server is on 3000")
})


//apikey
//f67b8b3945bd6348007c1b300a63b72d-us1

//listid
//31b2d299a5