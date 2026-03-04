# Configure login with Google and Microsoft authentication

To enable Google and Microsoft login on your cluster, follow these instructions.

## Google

1\. Go to https://console.cloud.google.com/apis/credentials.

2\. Open *CREATE CREDENTIALS* â†?*OAuth Client ID* â†?*Web application* â†?in the *Authorized JavaScript origins* section, insert the URL of your CloudHub cluster â†?*Create*.

3\. Copy *Client ID* and *Client secret*.

4\. Go to your `CloudHub-deploy` repository:

```
$ cd ~/CloudHub/CloudHub-deploy/
```

5\. Insert *Client ID* and *Client secret* copied on the third step into the `auth` and `ngui` sections:

-   [CloudHub-deploy/overlay/user_template.yml#L89](https://github.com/mspcloudopsengineer/awscloud/blob/integration/CloudHub-deploy/overlay/user_template.yml#L89), 

-   [CloudHub-deploy/overlay/user_template.yml#L90](https://github.com/mspcloudopsengineer/awscloud/blob/integration/CloudHub-deploy/overlay/user_template.yml#L90),

-   [CloudHub-deploy/overlay/user_template.yml#L96](https://github.com/mspcloudopsengineer/awscloud/blob/integration/CloudHub-deploy/overlay/user_template.yml#L96).

6\. Launch the command to restart the CloudHub with the updated overlay:

```
./runkube.py --with-elk -o overlay/user_template.yml -- <deployment name> <version>
```

## Microsoft

1\. Go to your Microsoft account.

2\. *All services* â†?*App Registrations* â†?select the application â†?Manage â†?*Authentication* â†?add a platform â†?*Single-page applications* â†?add two valid redirect URIs. For example, `https://your-CloudHub.com/login` and `https://your-CloudHub.com/register`.

3\. Go to *App Registration* â†?*Overview* â†?*Application* â†?copy *client_id*.

4\. Go to your `CloudHub-deploy` repository:

```
$ cd ~/CloudHub/CloudHub-deploy/
```

5\. Insert *client_id* copied on the third step into the `auth` and `ngui` sections: 

-   [CloudHub-deploy/overlay/user_template.yml#L97](https://github.com/mspcloudopsengineer/awscloud/blob/integration/CloudHub-deploy/overlay/user_template.yml#L97),

-   [CloudHub-deploy/overlay/user_template.yml#L91](https://github.com/mspcloudopsengineer/awscloud/blob/integration/CloudHub-deploy/overlay/user_template.yml#L91).

6\. Launch the command to restart the CloudHub with the updated overlay:

```
./runkube.py --with-elk -o overlay/user_template.yml -- <deployment name> <version>
```


