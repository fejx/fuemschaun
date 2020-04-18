import * as netflix from './netflix/netflix-aspects'

export const aspects = {}

addAspect(netflix)

function addAspect(aspect) {
    aspects[aspect.HOST] = aspect.weave
}