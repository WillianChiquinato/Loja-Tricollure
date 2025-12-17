<template>
    <div class="footer-container">
        <div class="flex gap-16 flex-row justify-center items-center py-6">
            <div class="flex gap-2 justify-center items-center py-4 flex-wrap Payment">
                <p>Meios de pagamento:</p>
                <img v-for="imagensPayment in sourcePayment" :key="imagensPayment.id" :src="imagensPayment.img" :alt="imagensPayment.alt" class="mx-3 my-2 sourcePayment"/>
            </div>
            
            <div class="flex gap-2 justify-center items-center py-4 flex-wrap Send">
                <p>Meios de envio:</p>
                <img v-for="imagensSend in sourceSend" :key="imagensSend.id" :src="imagensSend.img" :alt="imagensSend.alt" class="mx-3 my-2 sourcePayment"/>
            </div>
        </div>
        <p class="footer-text">Copyright Tricollute - 10967915000124 - 2025. Todos os direitos reservados.</p>
    </div>
</template>

<script setup lang="ts">
import Payment1 from '@/assets/Images/Payment1.png';
import Payment2 from '@/assets/Images/Payment2.png';
import Payment3 from '@/assets/Images/Payment3.png';
import Payment4 from '@/assets/Images/Payment4.png';
import Payment5 from '@/assets/Images/Payment5.png';
import Payment6 from '@/assets/Images/Payment6.png';
import Payment7 from '@/assets/Images/Payment7.png';
import Payment8 from '@/assets/Images/Payment8.png';
import Payment9 from '@/assets/Images/Payment9.png';
import Payment10 from '@/assets/Images/Payment10.png';

const sourcePayment = [
    {
        id: 1,
        img: Payment1,
        alt: 'Meios de pagamento'
    },
    {
        id: 2,
        img: Payment2,
        alt: 'Meios de pagamento'
    },
    {
        id: 3,
        img: Payment3,
        alt: 'Meios de pagamento'
    },
    {
        id: 4,
        img: Payment4,
        alt: 'Meios de pagamento'
    },
    {
        id: 5,
        img: Payment5,
        alt: 'Meios de pagamento'
    },
    {
        id: 6,
        img: Payment6,
        alt: 'Meios de pagamento'
    },
    {
        id: 7,
        img: Payment7,
        alt: 'Meios de pagamento'
    },
    {
        id: 8,
        img: Payment8,
        alt: 'Meios de pagamento'
    }
];

const sourceSend = [
    {
        id: 1,
        img: Payment9,
        alt: 'Meios de envio'
    },
    {
        id: 2,
        img: Payment10,
        alt: 'Meios de envio'
    }
];
</script>

<style scoped lang="scss">
.footer-container {
    background-color: #efedea;
    text-align: center;
    border-top: 1px solid #424242;

    .footer-text {
        background-color: #DBDBDB;
        font-weight: bold;
        font-size: 1rem;
    }
}

.sourcePayment {
    width: 30px;
    display: flex;
    height: auto;

    @media (min-width: 640px) {
        width: 45px;
    }
}

.Payment, .Send {
    margin: 1.5rem 0rem 3rem 0rem;

    @media (max-width: 640px) {
        flex-direction: column;
    }
}
</style>