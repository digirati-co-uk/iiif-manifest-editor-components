const download = (content, name) => {
  const element = document.createElement('a');
  const encodedContent = encodeURIComponent(JSON.stringify(content, null, 2));
  element.setAttribute(
    'href',
    `data:application/json;charset=utf-8,${encodedContent}`
  );
  element.setAttribute('download', name);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
};

export default download;
