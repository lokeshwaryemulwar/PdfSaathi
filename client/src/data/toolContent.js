import toolContentData from './toolContent.json';
export const toolContent = toolContentData;
export const getToolContent = (toolId) => {
    return toolContent[toolId] || toolContent['default'];
};
