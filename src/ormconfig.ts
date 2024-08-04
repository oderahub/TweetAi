import { DataSource, DataSourceOptions } from "typeorm";
import dotenv from "dotenv";
import { Autobot } from "./entities/Autobot";
import { Post } from "./entities/Post";
import { Comment } from "./entities/Comment";

dotenv.config();

const dataSourceOptions: DataSourceOptions = {
  type: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Autobot, Post, Comment],
  synchronize: false,
  logging: true,
};

const AppDataSource = new DataSource(dataSourceOptions);

export default AppDataSource;
