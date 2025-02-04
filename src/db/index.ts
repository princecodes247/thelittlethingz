import { array, createClient, createdAt, createDatabase, createSchema, date, literal, number, object, objectId, string, updatedAt } from "monarch-orm";

 
const client = createClient(process.env?.MONGODB_URL ?? 'mongodb://localhost:27017/thelittlethingz')
 
const UserSchema = createSchema("user", {
  name: string(),
  email: string(),
  emailVerified: string(),
  password: string(),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
//   isVerified: boolean(),
});


const _AccountSchema = createSchema("account", {
  accountId: string(),
  providerId: string(),
  userId: objectId(),
  password: string(),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

const _SessionSchema = createSchema("session", {
  expiresAt: string(),
  token: string(),
  ipAddress: string(),
  userAgent: string(),
  userId: objectId(),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

const ValentineSchema = createSchema("valentine", {
  name: string(),
  from: string().optional(),
  message: string().optional(),
  phoneNumber: string().nullable(),
  customUrl: string(),
  question: string().default("Will You Be My Valentine?"),
  status: literal("pending", "accepted", "rejected").default('pending'),
  creator: objectId(),
  images: array(string()).default([]),
  views: number().default(0),
  responses: array(object({
    response: string(),
    responseDate: date()
  })).default([]),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

const AccountSchema = _AccountSchema.relations(({one}) => (
  {
    userId: one(UserSchema, "_id")
  }
))

const SessionSchema = _SessionSchema.relations(({one}) => (
  {
    userId: one(UserSchema, "_id")
  }
))

const ValentineRelationsSchema = ValentineSchema.relations(({one}) => ({
  creator: one(UserSchema, "_id")
}));



const { db, collections } = createDatabase(client.db(), {
    user: UserSchema,
    account: AccountSchema,
    session: SessionSchema,
    valentine: ValentineRelationsSchema
});
 
export { client, db, collections };