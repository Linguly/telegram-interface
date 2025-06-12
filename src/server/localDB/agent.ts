import { LingulyContext } from '../scenes/util/sceneCommon';

export async function getAgentId(ctx: LingulyContext): Promise<string | undefined> {
    if (!ctx.session || !ctx.session.selectedAgent) {
        return undefined;
    }
    return ctx.session.selectedAgent.id;
}

export async function getSelectedAgent(ctx: LingulyContext): Promise<any | undefined> {
    if (!ctx.session || !ctx.session.selectedAgent) {
        return undefined;
    }
    return ctx.session.selectedAgent;
}

export async function setSelectedAgent(ctx: LingulyContext, selectedAgent: any) {
    if (!ctx.session) {
        ctx.session = {};
    }
    ctx.session.selectedAgent = selectedAgent;
}

export async function getSelectedGoal(ctx: LingulyContext): Promise<any | undefined> {
    if (!ctx.session || !ctx.session.selectedGoal) {
        return undefined;
    }
    return ctx.session.selectedGoal;
}

export async function setSelectedGoal(ctx: LingulyContext, selectedGoal: any) {
    if (!ctx.session) {
        ctx.session = {};
    }
    ctx.session.selectedGoal = selectedGoal;
}
