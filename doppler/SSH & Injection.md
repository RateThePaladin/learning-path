I have a love hate relationship with my homelab. I love building things and setting up new environments, but honestly once I build something I forget about it a few weeks later - including how to access it. Not a problem when you have a webpage and can recover a password, more of a problem when you lose the ssh key in your forest of .ssh keys.

![[ssh_key_example.png]]

Enter Doppler - a secret management platform that is primarily used for teams sharing access to common resources. I'll be using it to keep track of my ssh keys and their hosts, with the added security benefit of clearing out my .ssh folder.

```
doppler run -- doppler run --project ssh-tokens --config dev --mount ssh.key --mount-template ~/.ssh/HOST.key.tmpl --mount-max-reads 3 --command 'ssh $HOST_USER@$HOST_HOST -i ssh.key'
```

And here's the HOST.key.tmpl file:

```
{{.KUMA_KEY}}
```