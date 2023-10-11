const collegeModel = require("../models/collageModels")
const internModel = require("../models/internModels")



const isValid = function (value) {
    if (typeof value == undefined || value == null || value == 0) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true
}

// create college................................................

const createCollege = async function (req, res) {

    try {
        const data = req.body;

        if (Object.keys(data).length === 0) return res.status(400).send({ status: false, msg: 'BAD REQUEST' })
        if (!isValid(data.name)) return res.status(400).send({ status: false, msg: "Name is required" })
        if (!isValid(data.fullName)) return res.status(400).send({ status: false, msg: "Full Name is required" })
        if (!isValid(data.logoLink)) return res.status(400).send({ status: false, msg: "link is mandatory" })
        if ((/https?:\/\/(www\.)?[-a-zA-Z0-9@:%.\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%\+.~#?&//=]*)/.test(data.logoLink))) {
            //-----------------------------------------------------------------
            const sentnce = data.fullName
            let FirstCaptal = convertFirstLetterToUpperCase(sentnce)
            function convertFirstLetterToUpperCase(sentnce) {
                var splitStr = sentnce.toLowerCase().split(' ');
                for (var i = 0; i < splitStr.length; i++) {
                    splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
                }
                return splitStr.join(' ');
            }
            //---------------------------------------------------------------
            let duplicateName = await collegeModel.findOne({ name: data.name })
            if (duplicateName) return res.status(400).send({ status: false, msg: 'name already exist' })

            let duplicateLink = await collegeModel.findOne({ logoLink: data.logoLink })
            if (duplicateLink) return res.status(400).send({ status: false, msg: 'logoLink already exist' })

            let newData = { name: data.name, fullName: FirstCaptal, logoLink: data.logoLink, isDeleted: data.isDeleted }
            const savedData = await collegeModel.create(newData)
            return res.status(201).send({ status: true, data: savedData })

        } else return res.status(400).send({ status: false, msg: "invalid link" })

    } catch (err) {
        return res.status(500).send({ ERROR: err.message })
    }
}


// get college detalis......................................
const getDetails = async function (req, res) {
    try {
        let data = req.query.collegeName;
        if (!isValid(data)) return res.status(400).send({ status: false, msg: ' collage name required' })
        if (Object.keys(data).length === 0) return res.status(400).send({ status: false, msg: 'BAD REQUEST' })
        let lowerData = data.toLowerCase();
        let collageDetails = await collegeModel.findOne({ name: lowerData, isDeleted: false });
        // console.log(collageDetails)
        if (!collageDetails) return res.status(404).send({ status: false, msg: 'collage name not found' });
        let internDetails = await internModel.find({ collegeId: collageDetails._id, isDeleted: false }).select("_id name email mobile")
        // let internDetails = await internModel.find({ collegeId: collageDetails._id, isDeleted: false }).select({_id:1,name:1,email:1,mobile:1})
        let allDetails = { name: collageDetails.name, fullName: collageDetails.fullName, logoLink: collageDetails.logoLink, interests: internDetails }
        if (internDetails.length === 0) return res.status(404).send({ status: false, allDetails, msg: 'No interns applied' })
        return res.status(200).send({ status: true, data: allDetails })

    } catch (err) {
        return res.status(500).send({ error: err.message })
    }   

}


module.exports = {
    createCollege,
    getDetails
}
