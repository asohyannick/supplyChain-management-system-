import 'dotenv/config';
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import axios from 'axios';
import jwt from 'jsonwebtoken';
const redirectToGithubLogin = async (_req: Request, res: Response) => {
    try {
        const redirectURI = process.env.GITHUB_CALLBACK_URL as string;
        const clientId = process.env.GITHUB_CLIENT_ID as string;
        const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectURI}&scope=user:email`;
        return res.status(StatusCodes.OK).redirect(url);
    } catch (error) {
        console.error('Error during authentication:', error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Authentication failed');
    }
}

const handleGeneratedGitHubAccessToken = async (req: Request, res: Response) => {
    const { code } = req.query;
    if (!code) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid Token!" });
    }
    try{
        const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
            client_id: process.env.GITHUB_CLIENT_ID as string,
            client_secret: process.env.GITHUB_CLIENT_SECRET as string,
            code,
        }, {
            headers: {
                'Accept': 'application/json',
            },
        });

        const accessToken = tokenResponse.data.access_token;
    const userRes = await axios.get('https://api.github.com/user', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
     const emailRes = await axios.get('https://api.github.com/user/emails', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    const email = emailRes.data.find((e:any) => e.primary && e.verified)?.email;
    const user = userRes.data;
          
    const jwtToken = jwt.sign({ id: user.id, username: user.login, }, process.env.JWT_SECRET_KEY as string, {
        expiresIn: '7d',
    });
    console.log("GitHub User", {
        name: userRes.data.name,
        email,
    });
    res.cookie('token', jwtToken, {
        httpOnly: true, 
        maxAge: 90000,
        sameSite: 'strict',
        secure: process.env.NODE_ENV as string === 'production',
    });
    return res.redirect(`${process.env.FRONTEND_DOMAIN as string}/success`); // Redirect to your frontend
    } catch(error: unknown) {
        if (error instanceof Error) {
            console.error('Error during token exchange:', error.message || "Unknown Error Message");
        }
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to authenticate user', error});
    }
}

export {
    redirectToGithubLogin,
    handleGeneratedGitHubAccessToken
}