
const Users = [
    {
        id: 1,
        firstName: 'Nastya',
        lastName: 'Septilko'
    },
    {
        id: 2,
        firstName: 'Diana',
        lastName: 'Aqapkina'
    },
    {
        id: 3,
        firstName: 'Roma',
        lastName: 'Lepestok'
    }
];

module.exports = {
    getUserByFirstName: (firstName) => {
        return Users.find(user => user.firstName === firstName);
    },

    createUser: ({firstName, lastName}) => {
        const id = Users.length + 1;
        const newUser = {id, firstName, lastName};
        Users.push(newUser);
        return newUser;
    }
};
