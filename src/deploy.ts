import {exec} from 'shelljs'

type ServiceMap = {
    image: string,
    app: string
}

// TODO set to all for the moment until nx gets the correct diff
const apps: ServiceMap[] = [
    {
        image: 'breathalyser',
        app: 'breathalyser'
    },
    {
        image: 'core',
        app: 'core'
    },
    {
        image: 'identity',
        app: 'identity'
    },
    {
        image: 'insights',
        app: 'insights'
    },
    {
        image: 'off-licence',
        app: 'off-licence'
    },
    {
        image: 'gateway',
        app: 'api'
    },
];

const main = () => {
    const ECR_SECRET = process.env;

    if (!ECR_SECRET) {
        throw new Error('No ECR_SECRET value provided!');
    }

    exec(`aws ecr get-login-password --region eu-west-1 | docker login --username AWS --password-stdin ${ECR_SECRET}`);

    for (const service of apps) {
        const { image, app } = service;
        exec(`docker pull $ECR_SECRET/${image}:latest`);
        exec(`docker tag $ECR_SECRET/${image} dokku/${app}:latest`);
        exec(`dokku tags:deploy ${app}:latest`);
    }
};

main();
