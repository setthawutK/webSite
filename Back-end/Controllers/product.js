const Product = require('../Models/Product')
const fs = require('fs')

exports.read = async (req, res) => {
    try {
        // code
        const id = req.params.id
        const producted = await Product.findOne({ _id: id }).exec();
        res.send(producted)
    } catch (err) {
        // error
        console.log(err)
        res.status(500).send('Server Error')
    }
}

exports.list = async (req, res) => {
    try {
        // code
        const producted = await Product.find({}).exec();
        res.send(producted)
    } catch (err) {
        // error
        console.log(err)
        res.status(500).send('Server Error')
    }
}


exports.create = async (req, res) => {
    try {
        var data = req.body;

        if (req.files) {
            if (req.files.file) {
                data.file = req.files.file[0].filename;
            }

            if (req.files.file2) {
                data.file2 = req.files.file2[0].filename;
            }
        }

        if (data.tags && typeof data.tags === 'string') {
            data.tags = data.tags.split(',').map(tag => tag.trim());
        }

        const producted = await Product(data).save();
        res.send(producted);
    } catch (err) {
        // error
        console.log(err);
        res.status(500).send('Server Error');
    }
};


// exports.create = async (req, res) => {
//     try {
//         // code

//         var data = req.body
//         if (req.file) {
//             data.file = req.file.filename
//         }

//         const producted = await Product(data).save()
//         res.send(producted)
//     } catch (err) {
//         // error
//         console.log(err)
//         res.status(500).send('Server Error')
//     }
// }

exports.update = async (req, res) => {
    try {
        const id = req.params.id;
        var newData = req.body;
        if (req.files && req.files.file2) {
            newData.file2 = req.files.file2[0].filename; 
            if (newData.fileold) {
                await fs.unlink('./uploads/' + newData.fileold, (err) => {
                    if (err) {
                        console.error("Error deleting old file:", err);
                    } else {
                        console.log("Old file deleted successfully");
                    }
                });
            }
        }
        if (newData.tags && typeof newData.tags === 'string') {
            newData.tags = newData.tags.split(',').map(tag => tag.trim());
        }
        const updated = await Product.findOneAndUpdate(
            { _id: id },
            newData,
            { new: true } 
        ).exec();

        res.send(updated); 
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
};


exports.remove = async (req, res) => {
    try {
        // code
        const id = req.params.id
        const removed = await Product.findOneAndDelete({ _id: id }).exec()

        if (removed?.file) {
            await fs.unlink('./uploads/' + removed.file, (err) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log('Remove success')
                }
            })
        }

        res.send(removed)
    } catch (err) {
        // error
        console.log(err)
        res.status(500).send('Server Error')
    }
}


exports.getLatestProduct = async (req, res) => {
    try {
        const latestProduct = await Product.find().sort({ createdAt: -1 }).limit(9); 
        console.log(latestProduct);  
        console.log("เช็คๆ try")
        res.json(latestProduct);
    } catch (err) {
        console.log("เช็คๆ err")
        console.log(err);
        res.status(500).send('Server Error');
    }
};
