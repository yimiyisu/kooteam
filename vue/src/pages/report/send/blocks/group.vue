<template>
    <z-form-item label="抄送组" type="search" name="groups" depend="week_group" multiple />
</template>
<script>
export default {
    props: {
        value: Object
    },
}
</script>