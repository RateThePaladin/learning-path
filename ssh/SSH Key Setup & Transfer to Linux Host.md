
Hey kids! Let's create and transfer a new ssh key to a linux based vm that we already know the password to! Mac ---> Linux VM for this example, but it's pretty ubiquitous.

Create the key, where "username" is the username:
```
ssh-keygen -t ed25519 -C "username"
```
This command will ask you to name the file. I'll be using 'NewKey' in this example.

Now let's transfer said new key to the VM! Thankfully, if you've already SSH'd into this VM before, there's a pretty handy command that makes this easy as pi:
```
ssh-copy-id -i NewKey.pub username@host.name
```
After putting in the existing password for that user, the ssh public key will be added as a known host to the VM. 

Great, let's try using our fancy new key!
```
ssh -i NewKey username@host.name
```

If you're now inside a secure shell on the VM our work here is done! If you're planning on using doppler to keep track of this key, read this article next: [[SSH & Injection]]