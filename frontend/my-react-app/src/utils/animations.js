export const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.1,
        },
    },
};

export const itemVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.6,
            type: "spring",
            stiffness: 100,
            damping: 12
        }
    },
};

export const cardVariants = {
    initial: { opacity: 0, scale: 0.8, y: 30 },
    animate: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 120,
            damping: 15,
            duration: 0.6
        }
    },
    hover: {
        scale: 1.03,
        y: -5,
        transition: {
            duration: 0.3,
            type: "spring",
            stiffness: 400
        }
    }
};
