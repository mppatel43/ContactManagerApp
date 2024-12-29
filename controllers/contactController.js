const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");

//@dec get all contacts
//@route GET /api/contacts
//@access private
const getContact = asyncHandler(async(req,res) => {
    const contacts = await Contact.find({user_id: req.user.id});
    res.status(200).json(contacts);
});

//@dec post contacts
//@route POST /api/contacts
//@access private
const createContact = asyncHandler(async(req, res)=>{
    console.log("The request body is: ", req.body);
    const {name,email,phone} = req.body;
    if(!name || !email || !phone){
        res.status(404);
        throw new Error("All fildes are mandatory");
    }

    const contact = await Contact.create({
        name, email, phone, user_id: req.user.id
    })
    res.status(200).json(contact);
});

//@dec get contacts by id
//@route GET /api/contacts/:id
//@access private
const getContactByID = asyncHandler(async(req, res)=>{
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Contact not found");
    }
    res.status(200).json(contact);
});

//@dec update contacts by id
//@route PUT /api/contacts/:id
//@access private
const putContactByID = asyncHandler(async(req, res)=>{
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Contact not found");
    }

    if(contact.user_id.toString() !== req.user.id){
        res.status(403);
        throw new Error("User dont have permission to update other users contacts");
    }
    const updateContact = await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new: true}
    )
    res.status(200).json(updateContact);
});

//@dec delete contacts by id
//@route DELETE /api/contacts/:id
//@access private
const deleteContactByID = asyncHandler(async(req, res)=>{
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Contact not found");
    }

    if(contact.user_id.toString() !== req.user.id){
        res.status(403);
        throw new Error("User dont have permission to delete other users contacts");
    }

    await Contact.findByIdAndDelete(req.params.id);
    res.status(200).json(contact);
});

module.exports = {getContact, createContact, getContactByID, putContactByID, deleteContactByID};
