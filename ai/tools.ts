import { BiLogoPostgresql } from "react-icons/bi";
import { FaReact } from "react-icons/fa";
import { MdOutlineSearch } from "react-icons/md";

type Command = {
    id: string;
    name: string;
    tools: {
        id: string;
        name: string;
        description: string;
        icon: any;
    }[];
};

export const commands: Command[] = [
    {
        id: "tools",
        name: "Tools",
        tools: [
            {
                id: "search",
                name: "Search",
                description: "Search the web",
                icon: MdOutlineSearch,
            },
        ],
    },
    // {
    //   id: 'mcp',
    //   name: 'MCP',
    //   tools: [
    //     {
    //       id: 'react',
    //       name: 'React',
    //       description: 'React',
    //       icon: FaReact,
    //     },
    //     {
    //       id: 'postgres',
    //       name: 'Postgres',
    //       description: 'Postgres',
    //       icon: BiLogoPostgresql,
    //     },
    //   ],
    // },
];
