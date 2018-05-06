/**
 * @author Ali Ismael
 */

"use strict";

import React from "react";

function HeadMetaTags(model) {
    const retVal = [
        (<meta key="head_tag_1" charSet="utf-8"/>),

        (<title key="head_tag_2">{model.content.page.title}</title>),
        (<meta key="head_tag_3" name="keywords" content={model.content.page.keywords} />),
        (<meta key="head_tag_4" name="description" content={model.content.page.description}/>),
        (<meta key="head_tag_5" name="robots" content="NOODP"/>),
        (<meta key="head_tag_6" httpEquiv="X-UA-Compatible" content="IE=edge"/>),
        (<meta key="head_tag_7" name="application-name" content="dsoidc"/>),
        (<meta key="head_tag_11" name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=0"/>),
        (<link key="head_tag_20" rel="dns-prefetch" href="https://www.SampleAppusa.com/" />),
        (<meta key="head_tag_24" property="twitter:card" content="summary"/>),
        (<meta key="head_tag_25" property="twitter:site" content="@SampleAppusa"/>)
    ];

    return retVal;
}

export default HeadMetaTags;
