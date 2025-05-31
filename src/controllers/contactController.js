import Contact from "../models/Contact.js";

export const createContact = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    const contact = new Contact({ name, email, phone, message });
    await contact.save();

    res
      .status(201)
      .json({ success: true, message: "Liên hệ đã được gửi!", data: contact });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const getContacts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    const pageInt = parseInt(page);
    const limitInt = parseInt(limit);
    const skip = (pageInt - 1) * limitInt;

    const searchFilter = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { message: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const total = await Contact.countDocuments(searchFilter);

    const contacts = await Contact.find(searchFilter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitInt);

    res.json({
      success: true,
      data: {
        data: contacts,
        meta: {
          total,
          page: pageInt,
          limit: limitInt,
          totalPages: Math.ceil(total / limitInt),
          hasNextPage: pageInt * limitInt < total,
          hasPrevPage: pageInt > 1,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
