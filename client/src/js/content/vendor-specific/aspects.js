import * as netflix from './netflix-aspect'

export const aspects = {}

addAspect(netflix)

function addAspect(aspect) {
    aspects[aspect.HOST] = aspect.weave
}