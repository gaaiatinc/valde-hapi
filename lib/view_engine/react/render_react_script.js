/**
 *
 */
"use strict";

/**
 *
 * @param  {[type]} page_css_assets     [description]
 * @param  {[type]} app_script_url      [description]
 * @param  {[type]} isomorphic_template [description]
 * @param  {[type]} modelData           [description]
 * @return {[type]}                     [description]
 */
function perform_react_render(page_css_assets, app_script_url, isomorphic_template, modelData) {
    let render_template_element;

    let app_element = React.createElement(PageBundle.default, {
        modelData: modelData
    });

    let markup = "";

    if (modelData.renderEngineDirectives && modelData.renderEngineDirectives.staticRender) {
        render_template_element = app_element;
    } else {
        if (typeof isomorphic_template.default === "function") {
            let isomorphic_props = {
                app_element: app_element,
                body_class_name: "",
                filter_model_data: (typeof PageBundle.default.filterModelData === "function") ? PageBundle.default.filterModelData : function(modelData) {
                    return {};
                },
                assets: {
                    styles: [],
                    javascript: []
                },
                app_script_url: app_script_url,
                body_end_element: null,
                header_tags: [],
                modelData: modelData
            };

            let page_js_assets = [];
            if (typeof PageBundle.default.getExternalAssetsDescriptor === "function") {
                try {
                    let app_assets = PageBundle.default.getExternalAssetsDescriptor(modelData);
                    isomorphic_props.assets.styles = isomorphic_props.assets.styles.concat(app_assets.styles);
                    isomorphic_props.assets.javascript = isomorphic_props.assets.javascript.concat(app_assets.javascript);
                } catch (err) {
                    // logger.warn("Application's getExternalAssetsDescriptor caused an error: " + err);
                }
            }

            isomorphic_props.assets.styles = isomorphic_props.assets.styles.concat(page_css_assets);
            isomorphic_props.assets.javascript = isomorphic_props.assets.javascript.concat(page_js_assets);

            if (typeof PageBundle.default.getBodyEndElement === "function") {
                try {
                    isomorphic_props.body_end_element = React.createElement(PageBundle.default.getBodyEndElement(), {
                        modelData: modelData
                    });
                } catch (err) {
                    // logger.warn("Application's getBodyEndElement caused an error: " + err);
                }
            }

            if (typeof PageBundle.default.getHeaderTags === "function") {
                try {
                    isomorphic_props.header_tags = PageBundle.default.getHeaderTags(modelData);
                } catch (err) {
                    // logger.warn("Application's getHeaderTags caused an error: " + err);
                }
            }

            if (typeof PageBundle.default.getBodyClassName === "function") {
                try {
                    isomorphic_props.body_class_name = PageBundle.default.getBodyClassName(modelData);
                } catch (err) {
                    // logger.warn("Application's getBodyClassName caused an error: " + err);
                }
            }

            render_template_element = React.createElement(isomorphic_template.default, isomorphic_props);
        }
    }

    markup = "<!doctype html>\n" + ReactDOMServer.renderToStaticMarkup(render_template_element);

    return markup;
}
