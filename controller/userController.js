

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// AGORA APONTANDO PARA A PASTA module
const filePath = path.join(__dirname, "../module/users.json");

function readUsers() {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, "[]");
    }

    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
}

function saveUsers(users) {
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
}

export const register = async (req, res) => {
    try {
        const { username, fone, cep, endereco, password } = req.body;

        const users = readUsers();

        const userExists = users.find(user => user.username === username);
        if (userExists) {
            return res.status(400).json({ message: "Usuário já existe" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            id: Date.now().toString(),
            username,
            fone,
            cep,
            endereco,
            password: hashedPassword
        };

        users.push(newUser);
        saveUsers(users);

        res.status(201).json({ message: "Usuário cadastrado com sucesso" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao cadastrar usuário" });
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const users = readUsers();

        const user = users.find(user => user.username === username);
        if (!user) {
            return res.status(400).json({ message: "Usuário não encontrado" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Login ou senha incorreta" });
        }

        const token = jwt.sign(
            { userId: user.id },
            "segredo",
            { expiresIn: "1h" }
        );

        res.status(200).json({
            message: "Login realizado com sucesso",
            token,
            user: {
                id: user.id,
                username: user.username,
                fone: user.fone,
                cep: user.cep,
                endereco: user.endereco
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao fazer login" });
    }
};