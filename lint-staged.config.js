import path from "path";

export default {
    "*.{js,jsx,ts,tsx,json,css,md}": "prettier --write",
    "*.php": (filenames) => {
        const relativePaths = filenames.map((f) =>
            path.relative(process.cwd(), f),
        );
        return `docker compose exec -T app ./vendor/bin/pint ${relativePaths.join(
            " ",
        )}`;
    },
};
