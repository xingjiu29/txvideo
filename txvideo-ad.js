  function fixPauseAd(b, s, e) {
    const fs = jFields(b, s, e);
    const w = fs.find(x => x.tag === 1 && x.t === 10);
    if (!w || b[w.e - 1] !== 0x0b) return null;

    const ws = jFields(b, w.vs, w.e - 1);
    const l = ws.find(x => x.tag === 1 && x.t === 13);
    if (!l) return null;

    jHead(b, l.vs);
    const n = jInt(b, VP), ds = VP;
    if (ds + n !== l.e) return null;

    const inner = jFields(b, ds, l.e);
    const list = inner.find(x => x.tag === 0 && x.t === 9);

    if (!list || jInt(b, list.vs) <= 0 ||
        find(b, utf8("livemsg"), list.vs, list.e) < 0) return null;

    const le = new Map();
    le.set(l, jSimpleList(1, concat([
      new Uint8Array(jHeadEnc(0, 9)),
      jIntEnc(0, 0)
    ])));

    const nw = concat([
      b.subarray(w.s, w.vs),
      jRebuild(b, w.vs, w.e - 1, ws, le),
      new Uint8Array([0x0b])
    ]);

    const edits = new Map();
    edits.set(w, nw);
    return jRebuild(b, s, e, fs, edits);
  }
