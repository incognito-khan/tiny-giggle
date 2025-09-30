"use client"

import { Backpack, Bus, Building, Coffee, ArrowRight, Calendar } from "lucide-react"
import { FaShareAlt } from "react-icons/fa";
import { useRef, useEffect } from "react"
import { motion, useAnimation, useInView } from "framer-motion"
import { getAllBlogPosts } from "@/components/data/blog/blogdata"

export default function Blogs() {

  const blogsData = getAllBlogPosts()

  const ref = useRef(null)
  const subControls = useAnimation()
  const mainControls = useAnimation()
  const inView = useInView(ref, { once: false, amount: 0.4 })

  // Variant for individual characters
  const charVariant = {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } }
  }

  // Subheading container with staggered children
  const subVariants = {
    hidden: {},
    visible: { transition: { when: 'beforeChildren', staggerChildren: 0.03 } }
  }

  // Main heading container with staggered children
  const mainVariants = {
    hidden: {},
    visible: { transition: { when: 'beforeChildren', staggerChildren: 0.03 } }
  }

  useEffect(() => {
    if (inView) {
      // Animate subheading first
      subControls.start('visible').then(() => {
        // After 1s, animate main heading
        setTimeout(() => mainControls.start('visible'), 50)
      })
    } else {
      // Reset both
      subControls.start('hidden')
      mainControls.start('hidden')
    }
  }, [inView, mainControls, subControls])

  return (
    <div ref={ref} className="py-16 relative overflow-hidden"
      style={{ backgroundImage: "url(https://html.vecurosoft.com/toddly/demo/assets/img/class/class-bg.png)" }}
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-12">
          {/* Animated Subheading */}
          <motion.h3
            className="text-gray-500 text-sm font-medium tracking-wider uppercase mb-2"
            variants={subVariants}
            initial="hidden"
            animate={subControls}
          >
            {"OUR NEWS".split("").map((ch, i) => (
              <motion.span key={i} variants={charVariant} aria-hidden="true">
                {ch}
              </motion.span>
            ))}
          </motion.h3>

          {/* Animated Main Heading */}
          <motion.h2
            className="text-4xl font-bold text-gray-800 leading-tight"
            variants={mainVariants}
            initial="hidden"
            animate={mainControls}
          >
            {"Our News & Article".split("").map((ch, i) => (
              <motion.span key={i} variants={charVariant} aria-hidden="true">
                {ch}
              </motion.span>
            ))}
          </motion.h2>
        </div>

        {/* Facilities Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogsData.map((facility) => (
            <div
              key={facility.id}
              className="group bg-white rounded-2xl p-6 border-2 border-dashed border-gray-200 hover:border-orange-300 transition-all duration-500 shadow-[10px_10px_rgba(0,0,0,0.9)] hover:shadow-[5px_5px_rgba(194,123,12,0.9)]  cursor-pointer z-0"
            >
              {/* Image Container */}
              <div className="relative mb-6 overflow-hidden rounded-xl">
                <div
                  className="w-full h-[250px] bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{
                    backgroundImage: `url(${facility.image})`,
                  }}
                >
                  {/* Overlay that appears on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-4">

                <div className="flex gap-2 items-center">
                  <Calendar className="text-gray-600" />
                  <p className="text-sm text-gray-600">{facility.date}</p>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-800 group-hover:text-orange-600 transition-colors duration-300">
                  {facility.title}
                </h3>

                {/* Description */}
                <p className="text-gray-500 font-semibold text-base leading-relaxed">{facility.excerpt.slice(0, 90)}.</p>

                {/* Arrow Button */}
                <div className="pt-2 flex justify-between items-center">
                  <div className="flex gap-2 items-center">
                    <p className="text-gray-800 font-semibold hover:text-brand transition-all duration-300">Read More</p>
                      <ArrowRight className="w-5 h-5 text-brand font-semibold" />
                  </div>

                  <button
                    className={`w-12 h-12 bg-black group-hover:bg-brand rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110`}
                  >
                    <FaShareAlt className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
              <div className="absolute inset-0 rounded-2xl ring-2 ring-orange-200 ring-opacity-0 group-hover:ring-opacity-50 transition-all duration-500 pointer-events-none"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
