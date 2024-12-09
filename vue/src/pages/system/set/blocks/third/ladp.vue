<template>
    <z-form-items :fields="fields" />
</template>
<script>
export default {
    data() {
        return {
            fields: [
                { name: 'ldapUrl', label: 'url', placehoder: '举例：ldap://127.0.0.1:389' },
                { name: 'ldapBaseDn', label: 'baseDn', placehoder: '举例：DC=yimiyisu,DC=com' },
                { name: 'ldapBindDn', label: 'bindDn', placehoder: '举例：cn=admin,dc=yimiyisu,dc=com' },
                { name: 'ldapPassword', label: 'paasword' },
                { name: 'ldapUserFilter', label: 'userFilter', placehoder: '举例：cn=%s' },
                { name: 'ldapGroupFilter', label: 'groupFilter', placehoder: '举例：cn=%s' }
            ]
        }
    }
}
</script>
