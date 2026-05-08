async function check() {
  const repo = await fetch('https://codeberg.org/api/v1/repos/forgejo/forgejo');
  console.log('Repo:', repo.status, await repo.text().then(t => t.slice(0, 50)));
  
  const contents = await fetch('https://codeberg.org/api/v1/repos/forgejo/forgejo/contents');
  console.log('Contents:', contents.status, await contents.text().then(t => t.slice(0, 50)));

  const commits = await fetch('https://codeberg.org/api/v1/repos/forgejo/forgejo/commits?limit=1');
  console.log('Commits:', commits.status, await commits.text().then(t => t.slice(0, 50)));
}

check();
