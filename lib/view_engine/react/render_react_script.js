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

    const isValidIsomorphicProps = (isomorphic_props) => {
        if ((typeof isomorphic_props.filtered_model === "object") && (isomorphic_props.assets.javascript.length > 0) && (isomorphic_props.header_tags.length > 0)) {
            return true;
        }

        return false;
    };

    let markup = "";

    if (model.renderEngineDirectives && model.renderEngineDirectives.staticRender) {
        render_template_element = React.createElement(PageBundle.default, {model: model});
    } else {

        if (typeof isomorphic_template.default === "function") {

            let isomorphic_props = {
                // app_element_markup: app_element_markup,
                body_class_name: "",
                filtered_model: null,
                assets: {
                    styles: [],
                    javascript: []
                },
                // app_script_url: app_script_url,
                body_end_element: null,
                header_tags: [],
                // model: model
            };

            let app_element = React.createElement(PageBundle.default, {
                model: model,
                isomorphic_props: isomorphic_props
            });

            const app_element_markup = ReactDOMServer.renderToString(app_element);

            isomorphic_props.app_script_url = app_script_url;
            isomorphic_props.model = model;

            if (isValidIsomorphicProps(isomorphic_props)) {
                isomorphic_props.app_element_markup = app_element_markup;

                let page_js_assets = [];
                isomorphic_props.assets.styles = isomorphic_props
                    .assets
                    .styles
                    .concat(page_css_assets);
                isomorphic_props.assets.javascript = isomorphic_props
                    .assets
                    .javascript
                    .concat(page_js_assets);
            } else {
                isomorphic_props.app_element_markup = "<div> Error 501: invalid isomorphic_props </div>";
                // logger.warn("Application's getHeaderTags caused an error: " + err);
            }

            render_template_element = React.createElement(isomorphic_template.default, isomorphic_props);
        }
    }

    markup = "<!doctype html>\n" + ReactDOMServer.renderToStaticMarkup(render_template_element);

    return markup;
};
