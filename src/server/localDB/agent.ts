import { LingulyContext } from '../scenes/util/sceneCommon';

export async function getAgentId(ctx: LingulyContext): Promise<string | undefined> {
    if (!ctx.session || !ctx.session.selectedAgent) {
        return undefined;
    }
    return ctx.session.selectedAgent.id;
}

export async function setSelectedAgent(ctx: LingulyContext, selectedAgent: any) {
    if (!ctx.session) {
        ctx.session = {};
    }
    ctx.session.selectedAgent = selectedAgent;
}