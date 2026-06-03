import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

export const register = async (req, res) => {
    try {
        const { name, email, password } =
            req.body;

        const existingUser =
            await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        const user = await User.create({
            name,
            email,
            password,
        });

        res.status(201).json({
            success: true,
            token: generateToken(user._id),
            user,
        });
    }
    //   catch (error) {
    //     res.status(500).json({
    //       success: false,
    //       message: error.message,
    //     });
    //   }

    catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message,
            stack: error.stack,
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } =
            req.body;

        const user = await User.findOne({
            email,
        });

        if (
            !user ||
            !(await user.matchPassword(password))
        ) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        // res.json({
        //     success: true,
        //     token: generateToken(user._id),
        //     user,
        // });

        res.json({
            success: true,
            token: generateToken(user._id),
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getMe = async (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
};