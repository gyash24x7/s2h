module.exports = {
    stories: [
        "../stories/*.stories.tsx",
    ],
    addons: [
        "@storybook/addon-essentials"
    ],
    framework: "@storybook/react",
    core: {
        builder: "webpack5"
    }
}