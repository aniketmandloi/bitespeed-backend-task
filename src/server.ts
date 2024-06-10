import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post("/identify", async (req, res) => {
  const { email, phoneNumber } = req.body;

  if (!email && !phoneNumber) {
    return res
      .status(400)
      .json({ error: "Either email or phoneNumber is required" });
  }

  try {
    let contact = await prisma.contact.findFirst({
      where: {
        OR: [{ email }, { phoneNumber }],
      },
    });

    if (!contact) {
      contact = await prisma.contact.create({
        data: {
          email,
          phoneNumber,
          linkPrecedence: "primary",
        },
      });
      return res.json({
        contact: {
          primaryContactId: contact.id,
          emails: [email].filter(Boolean),
          phoneNumbers: [phoneNumber].filter(Boolean),
          secondaryContactIds: [],
        },
      });
    }

    const primaryContactId = contact.linkedId || contact.id;

    const contacts = await prisma.contact.findMany({
      where: {
        OR: [{ id: primaryContactId }, { linkedId: primaryContactId }],
      },
    });

    const emails = Array.from(
      new Set(contacts.map((c) => c.email).filter(Boolean))
    );
    const phoneNumbers = Array.from(
      new Set(contacts.map((c) => c.phoneNumber).filter(Boolean))
    );
    const secondaryContactIds = contacts
      .filter((c) => c.linkPrecedence === "secondary")
      .map((c) => c.id);

    if (
      contact.linkPrecedence === "primary" &&
      (email !== contact.email || phoneNumber !== contact.phoneNumber)
    ) {
      await prisma.contact.create({
        data: {
          email,
          phoneNumber,
          linkedId: primaryContactId,
          linkPrecedence: "secondary",
        },
      });
    }

    res.json({
      contact: {
        primaryContactId,
        emails,
        phoneNumbers,
        secondaryContactIds,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
