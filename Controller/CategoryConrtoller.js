const { object } = require('@hapi/joi');
const connection = require('../connection');
const helper = require('../helper');
const bas64Img = require('base64-img');
const fs = require('fs');

module.exports = {
    categoryCreate:(req, res)=>{
        let payload = req.body;

        const base64Arr = helper.decodeBase64Image(payload.c_image);
        const buffer = Buffer.from(base64Arr[2], "base64");
        let uploadPath = 'uploads';
        let fileName = Date.now()+'.png';
        fs.writeFileSync('./'+uploadPath+'/'+fileName, buffer);
        
        payload.c_image = {path:'./uploads', filename: fileName};
        payload.c_slug = helper.titletoslug(payload.c_name);
        let sql = "INSERT INTO categories(c_name, c_slug, c_image) values('"+payload.c_name+"', '"+payload.c_slug+"', '"+JSON.stringify(payload.c_image)+"')";
        connection.query(sql, function(err, result){
            if(err){
                throw err;
            }else{
                let msg = helper.responseJson(1, "Category created sucessfully");
                return res.status(200).send(msg);
            }
        });
    },
    categoryList: (req, res) => {
        let params = req.query;
        let page = 1;
        if(Object.keys(params).length > 0){
            if('page' in params){
                page = params.page;
            }
        }
        let pageOffset = 0;
        if(page > 1){
            pageOffset = 3*(page-1);
        }
        let sql = "SELECT * FROM categories LIMIT 3 OFFSET "+pageOffset;
        connection.query(sql, function(err, result){
            if(err){
                throw err;
            }else{
                let msg = helper.responseJson(1, 'Categories found', '', result);
                return res.status(200).send(msg);
            }
        });
    },
    categorySingle:(req, res) => {
        let params = req.params;

        let sql = "SELECT * FROM categories WHERE c_id='"+params.c_id+"'";
        connection.query(sql, function(err, result){
            if(err){
                throw err;
            }else{
                let msg = helper.responseJson(1, 'Category found', '', result[0]);
                return res.status(200).send(msg);
            }
        });
    },
    categoryUpdate: (req, res) => {
        let params = req.params;
        let sql = "SELECT * FROM categories WHERE c_id='"+params.c_id+"'";
        connection.query(sql, function(err, result){
            let catData = result[0];
            let oldImageData = JSON.parse(catData.c_image);
            if(err){
                throw err;
            }else{
                let payload = req.body;
                let newObj = {};
                if('c_image' in payload && (payload.c_image != '' || payload.c_image != null)){
                    const base64Arr = helper.decodeBase64Image(payload.c_image);
                    const buffer = Buffer.from(base64Arr[2], "base64");
                    let uploadPath = 'uploads';
                    let fileName = Date.now()+'.png';
                    fs.writeFileSync('./'+uploadPath+'/'+fileName, buffer);
                    
                    newObj.c_image = {path:'./uploads', filename: fileName};

                    if(fs.existsSync('./uploads/'+oldImageData.filename)){
                        fs.unlink('./uploads/'+oldImageData.filename, (err => {
                            if(err){
                                throw err;
                            }
                        }));
                    }
                }
                newObj.c_name = payload.c_name;
                newObj.c_slug = helper.titletoslug(payload.c_name);
                let updateSql = '';
                if('c_image' in payload && (payload.c_image != '' || payload.c_image != null)){
                    updateSql = "UPDATE categories SET c_name='"+newObj.c_name+"', c_slug='"+newObj.c_slug+"', c_image='"+JSON.stringify(newObj.c_image)+"' WHERE c_id='"+params.c_id+"'";
                }else{
                    updateSql = "UPDATE categories SET c_name='"+newObj.c_name+"', c_slug='"+newObj.c_slug+"' WHERE c_id='"+params.c_id+"'";
                }
                connection.query(updateSql, function(err, result){
                    if(err){
                        throw err;
                    }else{
                        let msg = helper.responseJson(1, "Categoryupdated successfully.");
                        return res.status(200).send(msg);
                    }
                });
            }
        });
    }
};