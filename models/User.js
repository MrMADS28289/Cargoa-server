const mongoose = require("mongoose");
const validator = require("validator");
const crypto = require("crypto");

const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
    {
        email: {
            type: String,
            validate: [validator.isEmail, "Provide a valid Email"],
            trim: true,
            lowercase: true,
            required: [true, "Email address is required"],
        },

        password: {
            type: String,
            required: [true, "Password is required"],
            minLength: [6, "password must be 6 carrectors"],
            maxLength: 20

            // its comment out for simplify
            // validate: {
            //     validator: (value) =>
            //         validator.isStrongPassword(value, {
            //             minLength: 6,
            //             minLowercase: 3,
            //             minNumbers: 1,
            //             minUppercase: 1,
            //             minSymbols: 1,
            //         }),
            //     message: "Password {VALUE} is not strong enough.",
            // },
        },

        confirmPassword: {
            type: String,
            required: [false, "Please confirm your password"],
            validate: {
                validator: function (value) {
                    return value === this.password;
                },
                message: "Passwords don't match!",
            },
        },

        role: {
            type: String,
            enum: ["Manufacturer", "Transporter", "admin"],
            required: [true, "Please select your roule"]
        },

        firstName: {
            type: String,
            required: [true, "Please provide a first name"],
            trim: true,
            minLength: [3, "Name must be at least 3 characters."],
            maxLength: [100, "Name is too large"],
        },

        lastName: {
            type: String,
            required: [false, "Please provide a last name"],
            trim: true,
            minLength: [3, "Name must be at least 3 characters."],
            maxLength: [100, "Name is too large"],
        },

        address: {
            type: String,
            required: [true, "Please Provide your address"],
            minLength: [2, "address must be 2 chacacters."]
        },

        contactNumber: {
            type: String,
            validate: [validator.isMobilePhone, "Please provide a valid contact number"],
        },

        imageURL: {
            type: String,
            validate: [validator.isURL, "Please provide a valid url"],
        },

        status: {
            type: String,
            default: "active",
            enum: ["active", "inactive", "blocked"],
        },

        confirmationToken: String,
        confirmationTokenExpires: Date,

        passwordChangedAt: Date,
        passwordResetToken: String,
        passwordResetExpires: Date,
    },
    {
        timestamps: true,
    }
);

userSchema.pre("save", function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    const password = this.password;

    const hashedPassword = bcrypt.hashSync(password);

    this.password = hashedPassword;
    this.confirmPassword = undefined;

    next();
});

userSchema.methods.comparePassword = function (password, hash) {
    const isPasswordValid = bcrypt.compareSync(password, hash);
    return isPasswordValid;
};

userSchema.methods.generateConfirmationToken = function () {
    const token = crypto.randomBytes(32).toString("hex");

    this.confirmationToken = token;

    const date = new Date();

    date.setDate(date.getDate() + 1);
    this.confirmationTokenExpires = date;

    return token;
};

const User = mongoose.model("User", userSchema);

module.exports = User;