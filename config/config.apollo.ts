import Apollo from '../app/lib/apollo';

exports = module.exports = async (apollo: Apollo, appConfig: { [x: string]: any }) => {
    
    return {
        ...appConfig,
        test: apollo.get('TEST'),
    };
};
