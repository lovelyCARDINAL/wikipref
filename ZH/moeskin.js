"use strict";
/* global mw, $ */
mw.loader.load(["ext.gadget.moeskin-topbar"]);

/* InpageEdit */
mw.hook("InPageEdit").add(function (ctx) {
    var InPageEdit = ctx.InPageEdit, wgPageName = mw.config.get("wgRelevantPageName"), wgRevisionId = mw.config.get("wgRevisionId");
    mw.hook("moeskin.pagetools").add(function (_a) {
        const $btn = _a.addPageToolsButton("<span style=\"align-self:center;font:0.7em bold;\">IPE</span>", "快速编辑");
        $btn.attr({ id: "ca-inpageedit", href: "javascript:void(0)" }).on("click", function () {
            InPageEdit.quickEdit({ page: wgPageName, revision: wgRevisionId || undefined });
        });
    });
    $(".page-tool-link#ca-inpageedit").insertAfter($(".page-tool-link#ca-edit"));
});