! function(a) {
	function e(e, n) {
		a.languages[e] && a.languages.insertBefore(e, "comment", {
			"doc-comment": n
		})
	}
	var n = a.languages.markup.tag,
		t = {
			pattern: /\/\/\/.*/,
			greedy: !0,
			alias: "comment",
			inside: {
				tag: n
			}
		},
		g = {
			pattern: /'''.*/,
			greedy: !0,
			alias: "comment",
			inside: {
				tag: n
			}
		};
	e("csharp", t), e("fsharp", t), e("vbnet", g)
}(Prism);
