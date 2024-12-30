const fullNames = Buff.fullNames;

Views.registerView('buffsContainer', {
  selector: '#buffsContainer',
  html() {
    let html = '';

    for (const name of buffList) {
      const fullName = fullNames[name];
      const XMLName = getXMLName(fullName);
      const desc2 = _txtsObj(`buffs>${XMLName}`)[0].innerHTML.includes('desc2');

      html += `
        <div 
          class="buffContainer showthat" 
          id="buff${name}Container" 
          onmouseover="view.showBuff('${name}')" 
          onmouseout="view.showBuff(undefined)">
          <div class="buffNameContainer">
            <img class="buffIcon" src="icons/${camelize(fullName)}.svg">
            <div class="skillLabel medium bold">${_txt(`buffs>${XMLName}>label`)}</div>
            <div class="showthis">
              <span>${_txt(`buffs>${XMLName}>desc`)}</span>
              <br>
              ${desc2 ? `<span class="localized" data-lockey="buffs>${XMLName}>desc2"></span>` : ''}
            </div>
          </div>
          <div class="buffNumContainer">
            <div id="buff${name}Level">0/</div>
            <input 
              type="number" 
              id="buff${name}Cap" 
              class="buffmaxinput" 
              value="${buffHardCaps[name]}" 
              onchange="updateBuffCaps()">
          </div>
        </div>
      `;
    }

    return html;
  },
});
