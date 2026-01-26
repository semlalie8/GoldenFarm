import Project from '../models/projectModel.js';
import eventBus from '../utils/eventBus.js';

export const createNewProject = async (userId, projectData) => {
    const project = new Project({
        user: userId,
        ...projectData,
        status: 'pending' // Requires admin approval
    });

    const createdProject = await project.save();

    // Notify listeners about new project request
    eventBus.emit('project.created', createdProject);

    return createdProject;
};

export const updateProjectDetails = async (projectId, updates) => {
    const project = await Project.findById(projectId);
    if (!project) throw new Error('Project not found');

    // Only update fields that are provided
    Object.keys(updates).forEach(key => {
        if (updates[key] !== undefined) {
            project[key] = updates[key];
        }
    });

    return await project.save();
};

export const approveProjectRequest = async (projectId) => {
    const project = await Project.findById(projectId);
    if (!project) throw new Error('Project not found');

    project.status = 'approved';
    const updatedProject = await project.save();

    // Trigger post-approval workflows (e.g., Marketing blast)
    eventBus.emit('project.approved', updatedProject);

    return updatedProject;
};
