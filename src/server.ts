import express from "express";
import { PrismaClient } from "@prisma/client";
import bodyParser from "body-parser";

const app = express();
const prisma = new PrismaClient();

// Use body-parser middleware to parse JSON requests
app.use(bodyParser.json());

app.post("/identify", async (req, res) => {
  const { email, phoneNumber } = req.body;

  if (!email && !phoneNumber) {
    return res.status(400).json({ error: "Email or phoneNumber required" });
  }

  let contacts = await prisma.contact.findMany({
    where: {
      OR: [
        { email: email || undefined },
        { phoneNumber: phoneNumber || undefined },
      ],
    },
  });

  if (contacts.length === 0) {
    const newContact = await prisma.contact.create({
      data: {
        email,
        phoneNumber,
        linkPrecedence: "primary",
      },
    });

    return res.json({
      contact: {
        primaryContactId: newContact.id,
        emails: [newContact.email],
        phoneNumbers: [newContact.phoneNumber],
        secondaryContactIds: [],
      },
    });
  }

  let primaryContact = contacts.find((c) => c.linkPrecedence === "primary");
  if (!primaryContact) {
    primaryContact = contacts[0];
  }

  const secondaryContacts = contacts.filter((c) => c.id !== primaryContact.id);

  if (secondaryContacts.length > 0) {
    await prisma.contact.updateMany({
      where: {
        id: {
          in: secondaryContacts.map((c) => c.id),
        },
      },
      data: {
        linkedId: primaryContact.id,
        linkPrecedence: "secondary",
      },
    });
  }

  if (
    !contacts.find((c) => c.email === email || c.phoneNumber === phoneNumber)
  ) {
    const newSecondary = await prisma.contact.create({
      data: {
        email,
        phoneNumber,
        linkedId: primaryContact.id,
        linkPrecedence: "secondary",
      },
    });
    secondaryContacts.push(newSecondary);
  }

  const response = {
    contact: {
      primaryContactId: primaryContact.id,
      emails: [
        primaryContact.email,
        ...secondaryContacts.map((c) => c.email),
      ].filter(Boolean),
      phoneNumbers: [
        primaryContact.phoneNumber,
        ...secondaryContacts.map((c) => c.phoneNumber),
      ].filter(Boolean),
      secondaryContactIds: secondaryContacts.map((c) => c.id),
    },
  };

  res.json(response);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(
    `Copy this URL to use the API: http://localhost:${PORT}/identify`
  );
});
