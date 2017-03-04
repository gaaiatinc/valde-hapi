/**
 *
 */
"use strict";

/**
 *
 * @param  {[type]} page_css_assets     [description]
 * @param  {[type]} app_script_url      [description]
 * @param  {[type]} isomorphic_template [description]
 * @param  {[type]} model           [description]
 * @return {[type]}                     [description]
 */
const perform_react_render = (page_css_assets, app_script_url, isomorphic_template, model) => {
    let render_template_element;

    let app_element = React.createElement(PageBundle.default, {model: model});

    let markup = "";

    if (model.renderEngineDirectives && model.renderEngineDirectives.staticRender) {
        render_template_element = app_element;
    } else {
        if (typeof isomorphic_template.default === "function") {
            let pageBundleObj = new PageBundle.default();

            let isomorphic_props = {
                app_element: app_element,
                body_class_name: "",
                filter_model_data: (model) => {
                    return {};
                },
                assets: {
                    styles: [],
                    javascript: []
                },
                app_script_url: app_script_url,
                body_end_element: null,
                header_tags: [],
                model: model
            };

            if (typeof pageBundleObj.filterModelData === "function") {
                isomorphic_props.filter_model_data = pageBundleObj.filterModelData;
            } else if (typeof PageBundle.default.filterModelData === "function") {
                isomorphic_props.filter_model_data = PageBundle.default.filterModelData;
            }

            let page_js_assets = [];
            let externalAssetsDescriptorFactory;
            if (typeof pageBundleObj.getExternalAssetsDescriptor === "function") {
                externalAssetsDescriptorFactory = pageBundleObj.getExternalAssetsDescriptor;
            } else if (typeof PageBundle.default.getExternalAssetsDescriptor === "function") {
                externalAssetsDescriptorFactory = PageBundle.default.getExternalAssetsDescriptor;
            }
            if (externalAssetsDescriptorFactory) {
                try {
                    let app_assets = externalAssetsDescriptorFactory(model);
                    isomorphic_props.assets.styles = isomorphic_props.assets.styles.concat(app_assets.styles);
                    isomorphic_props.assets.javascript = isomorphic_props.assets.javascript.concat(app_assets.javascript);
                } catch (err) {
                    // logger.warn("Application's getExternalAssetsDescriptor caused an error: " + err);
                }
            }
            isomorphic_props.assets.styles = isomorphic_props.assets.styles.concat(page_css_assets);
            isomorphic_props.assets.javascript = isomorphic_props.assets.javascript.concat(page_js_assets);


            let BodyEndElementComponentFactory;
            if (typeof pageBundleObj.getBodyEndElement === "function") {
                BodyEndElementComponentFactory = pageBundleObj.getBodyEndElement;
            } else if (typeof PageBundle.default.getBodyEndElement === "function") {
                BodyEndElementComponentFactory = PageBundle.default.getBodyEndElement;
            }
            if(BodyEndElementComponentFactory) {
                try {
                    isomorphic_props.body_end_element = BodyEndElementComponentFactory(model);
                } catch (err) {
                    // logger.warn("Application's getBodyEndElement caused an error: " + err);
                }
            }

            let headerTagsFactory;
            if (typeof pageBundleObj.getHeaderTags === "function") {
                headerTagsFactory = pageBundleObj.getHeaderTags;
            } else if (typeof PageBundle.default.getHeaderTags === "function") {
                headerTagsFactory = PageBundle.default.getHeaderTags;
            }
            if(headerTagsFactory) {
                try {
                    isomorphic_props.header_tags = headerTagsFactory(model);
                } catch (err) {
                    // logger.warn("Application's getHeaderTags caused an error: " + err);
                }
            }

            let bodyClassNameFactory;
            if (typeof pageBundleObj.getBodyClassName === "function") {
                bodyClassNameFactory = pageBundleObj.getBodyClassName;
            } else if (typeof PageBundle.default.getBodyClassName === "function") {
                bodyClassNameFactory = PageBundle.default.getBodyClassName;
            }
            if(bodyClassNameFactory) {
                try {
                    isomorphic_props.body_class_name = bodyClassNameFactory(model);
                } catch (err) {
                    // logger.warn("Application's getBodyClassName caused an error: " + err);
                }
            }

            render_template_element = React.createElement(isomorphic_template.default, isomorphic_props);
        }
    }

    markup = "<!doctype html>\n" + ReactDOMServer.renderToStaticMarkup(render_template_element);

    return markup;
};
