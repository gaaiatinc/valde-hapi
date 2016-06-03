db = db.getSiblingDB('sa_db');

db.runCommand({dropAllUsersFromDatabase: 1, writeConcern: {w: "majority"}});

db.dropDatabase();

db.createUser(
    {
        user: "sa_db_user",
        pwd: "sa_user_pwd",
        roles: [{role: "readWrite", db: "sa_db"}]
    }
);

/////////////////////////////


//////////////////////////////
var sa_customer_account_1 = {
    first_name: "April",
    middle_name: "June",
    last_name: "Doe",
    phone_number: "650-555-1234",
    email_address: "april@samplecorp.com",
    picture_url: "https://github.com/favicon.ico",
    account_hash_code: "197210abc540",
    signin_method: {
        auth_provider: "SAMPLEAPP",
        user_id: "april@samplecorp.com",
        access_token: "sa666"
    },
    addresses: [
        {
            address_1: "666 Magic Ae",
            address_2: "",
            address_3: "",
            city: "Mountain View",
            state: "CA",
            country: "US",
            postal_code: "94040",
            default: true
        }
    ],
    date_created: new Date(),
    date_last_updated: new Date()
};
db.sa_customer_accounts.insert(sa_customer_account_1);


//////////////////////////////////
