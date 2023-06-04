const { signupService, findUsersByRole } = require("../services/user.service");
const { generateToken } = require("../utils/token");

exports.signup = async (req, res) => {
    try {
        const user = await signupService(req.body);

        res.status(200).json({
            status: "success",
            message: "Successfully signed up",
            data: user
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "fail",
            error,
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(401).json({
                status: "fail",
                error: "Please provide your credentials",
            });
        }

        const user = await findUserByEmail(email);

        if (!user) {
            return res.status(401).json({
                status: "fail",
                error: "No user found. Please create an account",
            });
        }

        const isPasswordValid = user.comparePassword(password, user.password);

        if (!isPasswordValid) {
            return res.status(403).json({
                status: "fail",
                error: "Password is not correct",
            });
        }

        // comment out for simplify
        // if (user.status != "active") {
        //     return res.status(401).json({
        //         status: "fail",
        //         error: "Your account is not active yet.",
        //     });
        // }

        const token = generateToken(user);

        const { password: pwd, ...others } = user.toObject();

        res.status(200).json({
            status: "success",
            message: "Successfully logged in",
            data: {
                user: others,
                token,
            },
        });
    } catch (error) {
        res.status(500).json({
            status: "fail",
            error,
        });
    }
};

exports.getUsers = async (req, res) => {
    try {
        // console.log(req.body)
        const users = await findUsersByRole(req.body);

        res.status(200).json({
            status: "success",
            data: users,
        });
    } catch (error) {
        res.status(500).json({
            status: "fail",
            error,
        });
    }
};

